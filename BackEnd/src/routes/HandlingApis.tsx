import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from 'hono/jwt';
import OpenAI from "openai";


export const VerifyRouter = new Hono<{
    Bindings: {
        GitHub_URL: any;
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userID: string;
    }
}>();



const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-52fb024b475647ef9c5e148bb7dca298'
});

// 🔐 Auth Middleware
VerifyRouter.use("/*", async (c, next) => {
    const header = c.req.header('authorization') || "";
    const user = await verify(header, c.env.JWT_SECRET);
    if (user) {
        // @ts-ignore
        c.set("userID", user.id);
        await next();
    } else {
        c.status(403);
        return c.json({ error: "Unauthorized" });
    }
});

// 🧠 Generate Codes + Store Input
VerifyRouter.post("/GenerateAndStore", async (c) => {
    // Initialize Prisma with Accelerate
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const query = await c.req.json();
    const { name, age, symptoms, description } = query;

    console.log("Input:", name, age, symptoms, description);

    // Strict prompt for 3 codes
    const prompt = `
        You are a medical coding assistant.
        Task: Suggest exactly 3 most relevant codes for the given clinical input.
        Codes can be from ICD-11 or Namaste system.
        Return only JSON in this format:
        {
        "codes": [
            { "code": "XXXX", "system": "ICD-11" },
            { "code": "YYYY", "system": "Namaste" },
            { "code": "ZZZZ", "system": "ICD-11" }
        ]
        }

        Input:
        Name: ${name}
        Age: ${age}
        Symptoms: ${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms}
        Description: ${description}
        `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "deepseek-chat",
            temperature: 0,
        });

        const aiResponse = completion.choices?.[0]?.message?.content || "";
        console.log("DeepSeek raw output:", aiResponse);

        // Parse JSON safely
        let parsedCodes: any[] = [];
        try {
            const parsed = JSON.parse(aiResponse);
            parsedCodes = parsed.codes || [];
        } catch (e) {
            console.error("Error parsing AI response:", e);
        }

        // Store in DB
        const patientInput = await prisma.patientInput.create({
            data: {
                name,
                age,
                description,
                codes: {
                    create: parsedCodes.map((c: any) => ({
                        code: c.code,
                        system: c.system
                    }))
                }
            },
            include: { codes: true }
        });

        return c.json({
            message: "Data stored successfully",
            patientInput
        });

    } catch (err) {
        console.error("Error during AI/DB process:", err);
        return c.json({ error: "Failed to process request" }, 500);
    }
});


VerifyRouter.get("/search", async (c) => {
    // Initialize Prisma with Accelerate
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const role = c.req.header("x-role") || "doctor";
    // later: embed role inside JWT claims instead of header

    const query = c.req.query("query") || "";
    const system = c.req.query("system"); // "ICD-11" | "Namaste" | undefined
    const limit = parseInt(c.req.query("limit") || "25");
    const page = parseInt(c.req.query("page") || "1");
    const skip = (page - 1) * limit;

    if (!query) return c.json({ results: [] });

    // 🔍 Search PatientInput by name/description
    const patientMatches = await prisma.patientInput.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } }
            ]
        },
        include: { codes: true },
        take: limit,
        skip
    });

    // 🔍 Search InputCode by code
    const codeMatches = await prisma.inputCode.findMany({
        where: {
            AND: [
                { code: { contains: query, mode: "insensitive" } },
                ...(system ? [{ system }] : [])
            ]
        },
        take: limit,
        skip
    });

    // Load the patientInput rows for the matched input_ids (avoid relying on a relation name that may not exist)
    const inputIds = Array.from(new Set(codeMatches.map(cm => cm.input_id)));
    const patients = inputIds.length
        ? await prisma.patientInput.findMany({
            where: { input_id: { in: inputIds } },
            include: { codes: true }
        })
        : [];
    const patientById = new Map(patients.map(p => [p.input_id, p]));

    // 📌 Merge + format
    const results = [
        ...patientMatches.map(p => ({
            input_id: p.input_id,
            name: p.name,
            age: p.age,
            description: p.description,
            codes: (p as any).codes || [],
            source: "patient"
        })),
        ...codeMatches.map(c => {
            const p = patientById.get(c.input_id);
            return {
                input_id: c.input_id,
                name: p?.name ?? null,
                age: p?.age ?? null,
                description: p?.description ?? null,
                codes: (p as any)?.codes || [],
                matched_code: c.code,
                matched_system: c.system,
                source: "code"
            };
        })
    ];

    // 📝 Add role-specific metadata
    if (role === "admin") {
        return c.json({
            query,
            system: system || "all",
            count: results.length,
            role,
            results,
            admin_note: "Full access + audit features enabled"
        });
    }

    return c.json({
        query,
        system: system || "all",
        count: results.length,
        role,
        results
    });
});


