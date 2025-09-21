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

VerifyRouter.get("/me", async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    // 👇 Get userId from middleware (set during auth)
    const userId = c.get("userID");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

VerifyRouter.get("/autocomplete", async (c) => {
    const prisma = (new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())) as any;
    const query = c.req.query("q") || "";
    if (!query) return c.json({ suggestions: [] });

    // 1️⃣ Normal DB search first
    let matches = await prisma.disease.findMany({
        where: {
            OR: [
                { description: { contains: query, mode: "insensitive" } },
                { names: { some: { name: { contains: query, mode: "insensitive" } } } }
            ]
        },
        take: 10,
        include: { names: true }
    });

    // 2️⃣ If no results, fallback to AI for normalization / transliteration
    if (matches.length === 0) {
        const prompt = `
      A doctor typed: "${query}".
      Suggest the most likely normalized Ayurvedic disease term(s).
      Return JSON array of strings:
      ["normalized term 1", "normalized term 2"]
    `;

        const completion = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [{ role: "system", content: prompt }],
            temperature: 0,
        });

        try {
            const aiTerms = JSON.parse(completion.choices[0]?.message?.content || "[]");

            // Retry DB search with AI-suggested variants
            matches = await prisma.disease.findMany({
                where: {
                    OR: aiTerms.flatMap((t: string) => ([
                        { description: { contains: t, mode: "insensitive" } },
                        { names: { some: { name: { contains: t, mode: "insensitive" } } } }
                    ]))
                },
                take: 10,
                include: { names: true }
            });
        } catch (err) {
            console.error("❌ AI normalization failed:", err);
        }
    }

    return c.json({
        suggestions: matches.map((d: any) => ({
            id: d.id,
            code: d.namasteCode || d.icd11Code,
            system: d.source,
            displayNames: d.names.map((n: any) => ({
                name: n.name,
                language: n.language
            })),
            description: d.description
        }))
    });
});



// GET /disease/:id/details
VerifyRouter.get("/disease/:id/details", async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate()) as any;
    const id = c.req.param("id");

    try {
        const disease = await prisma.disease.findUnique({
            where: { id },
            include: ({ names: true, mappings: true } as any),
        });

        if (!disease) return c.json({ error: "Disease not found" }, 404);

        return c.json({
            id: disease.id,
            code: disease.namasteCode || disease.icd11Code,
            system: disease.source,
            display: ((disease as any).names?.[0]?.name) || disease.description,
            description: disease.description,
            icd11Mappings: ((disease as any).mappings || []).map((m: any) => ({
                id: m.id,
                code: m.icd11Code,
                system: "ICD-11",
                display: m.description,
                priority: m.priority,
                validated: m.validated,
            })),
        });
    } catch (err) {
        console.error("❌ /disease/:id/details failed", err);
        return c.json({ error: "Failed to fetch disease details" }, 500);
    }
});


 // POST /disease/:id/map
VerifyRouter.post("/disease/:id/map", async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate()) as any;
    const id = c.req.param("id");

    try {
        const disease = await prisma.disease.findUnique({ where: { id } });
        if (!disease) return c.json({ error: "Disease not found" }, 404);

        // 1) Check DB first (keeps future persistence)
        let icdMappings: any[] = await prisma.diseaseMapping.findMany({ where: { diseaseId: id } });
        if (icdMappings && icdMappings.length > 0) {
            return c.json({ mappings: icdMappings });
        }

        // 2) Build a strict prompt asking for JSON only
        const prompt = `
Map this Namaste disease to the 3 most relevant ICD-11 codes.
Return ONLY a valid JSON array (no commentary). Example:
[
  { "code": "XA00", "description": "Short description" },
  { "code": "XB11", "description": "Short description" },
  { "code": "XC22", "description": "Short description" }
]

Disease: ${disease.description}
`;

        // 3) Call DeepSeek / OpenAI
        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: "deepseek-chat",
                messages: [{ role: "system", content: prompt }],
                temperature: 0,
            });
        } catch (err) {
            console.error("❌ AI call failed", err);
            return c.json({ error: "AI request failed" }, 502);
        }

        const rawCandidates = [
            // Prefer modern "message.content"
            completion?.choices?.[0]?.message?.content,
            // fallback older shapes (cast to any for compatibility with older response shapes)
            (completion as any)?.choices?.[0]?.text,
            // last fallback stringify entire completion
            JSON.stringify(completion),
        ].filter(Boolean).join("\n");

        // Helper: try extract JSON array or objects from raw text
        const extractJsonArray = (text: string): any[] | null => {
            if (!text || !text.trim()) return null;

            // 1) direct JSON parse
            try {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) return parsed;
                // if parsed is an object, wrap it
                if (typeof parsed === "object" && parsed !== null) return [parsed];
            } catch { }

            // 2) codeblock with ```json ... ```
            const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
            if (codeBlock) {
                try {
                    const parsed = JSON.parse(codeBlock[1].trim());
                    if (Array.isArray(parsed)) return parsed;
                    if (typeof parsed === "object" && parsed !== null) return [parsed];
                } catch { }
            }

            // 3) first [...] block
            const arrayBlock = text.match(/\[([\s\S]*?)\]/);
            if (arrayBlock) {
                const arrText = arrayBlock[0];
                try {
                    const parsed = JSON.parse(arrText);
                    if (Array.isArray(parsed)) return parsed;
                } catch { }
            }

            // 4) extract all {...} occurrences (could be separate objects)
            const objMatches = [...text.matchAll(/\{[\s\S]*?\}/g)];
            if (objMatches.length > 0) {
                const parsedObjs: any[] = [];
                for (const m of objMatches) {
                    try {
                        const obj = JSON.parse(m[0]);
                        if (obj && typeof obj === "object") parsedObjs.push(obj);
                    } catch {
                        // ignore invalid object
                    }
                }
                if (parsedObjs.length) return parsedObjs;
            }

            return null;
        };

        // Helper: fallback parse "CODE - description" lines
        const parseLinesToMappings = (text: string) => {
            const results: any[] = [];
            const lines = text.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
            for (const line of lines) {
                // skip lines that look like JSON or instructions
                if (line.startsWith("{") || line.startsWith("[") || line.startsWith("```")) continue;

                // formats to try:
                // "A00 - Cholera", "A00: Cholera", "A00 — Cholera", "A00 Cholera"
                const m = line.match(/^["']?([A-Za-z0-9.\-\/]{1,12})["']?\s*[:\-–—]?\s*(.+)$/);
                if (m && m[1] && m[2]) {
                    results.push({ code: m[1].trim(), description: m[2].replace(/^["']|["']$/g, "").trim() });
                }
            }
            return results;
        };

        // 4) Try extraction
        const raw = rawCandidates;
        let parsed: any[] | null = extractJsonArray(raw);

        // 5) If no JSON array found, try line parsing heuristics
        if (!parsed || parsed.length === 0) {
            const fallback = parseLinesToMappings(raw);
            if (fallback.length > 0) parsed = fallback;
        }

        // 6) If still nothing, return helpful debug info (but avoid leaking keys)
        if (!parsed || parsed.length === 0) {
            console.error("❌ AI returned unexpected content:", raw);
            return c.json({
                error: "AI returned unexpected format. See server logs for raw output.",
            }, 500);
        }

        // 7) Normalize parsed entries into { code, description }
        const normalized = parsed
            .map((m: any) => {
                if (!m) return null;
                if (typeof m === "string") {
                    // string might be "A00 - Cholera"
                    const mm = m.match(/^["']?([A-Za-z0-9.\-\/]{1,12})["']?\s*[:\-–—]?\s*(.+)$/);
                    if (mm) return { code: mm[1].trim(), description: mm[2].trim() };
                    return null;
                } else if (typeof m === "object") {
                    // pick best keys
                    const code = (m.code || m.icd11Code || m.ICD11 || m.codeValue || m.C) ? String(m.code || m.icd11Code || m.ICD11 || m.codeValue || m.C) : null;
                    const description = (m.description || m.desc || m.name || m.label) ? String(m.description || m.desc || m.name || m.label) : "";
                    if (code) return { code: code.trim(), description: description.trim() };
                }
                return null;
            })
            .filter(Boolean) as { code: string; description: string }[];

        if (normalized.length === 0) {
            console.error("❌ Normalization failed for AI output:", raw);
            return c.json({ error: "AI returned data that couldn't be normalized" }, 500);
        }

        // 8) Persist (create) into DB and return created rows
        const created = await Promise.all(
            normalized.slice(0, 10).map(async (m, i) => {
                try {
                    const createdRow = await prisma.diseaseMapping.create({
                        data: {
                            diseaseId: disease.id,
                            icd11Code: m.code,
                            description: m.description || null,
                            priority: i + 1,
                            validated: false,
                        },
                    });
                    return createdRow;
                } catch (err) {
                    console.error("❌ Failed to create mapping for", m, err);
                    return null;
                }
            })
        );

        const success = created.filter(Boolean);
        if (success.length === 0) {
            return c.json({ error: "Failed to persist AI mappings" }, 500);
        }
        await logAudit(prisma, {
            action: "UPDATE",
            resource: `Disease/${id}`,
            user: c.get("userID") || "System",
            status: "success",
            details: `Mapped Disease to ${success.length} ICD-11 codes`
        });

        return c.json({ mappings: success });
    } catch (err) {
        console.error("❌ /disease/:id/map unexpected error", err);

        try {
            await logAudit(prisma, {
                action: "UPDATE",
                resource: `Disease/${id}`,
                user: c.get("userID") || "System",
                status: "error",
                details: "Unexpected error during mapping"
            });
        } catch (auditErr) {
            console.error("❌ Failed to log audit", auditErr);
        }

        return c.json({ error: "Internal server error" }, 500);
    }
});

VerifyRouter.post("/patient/register", async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    const { patientId, givenName, gender, birthDate, codes } = await c.req.json();

    try {
        const patient = await prisma.patient.create({
            data: {
                externalId: patientId,
                givenName,
                gender,
                birthDate: new Date(birthDate),
                codes: {
                    create: codes.map((c: any, i: number) => ({
                        code: c.code,
                        system: c.system,
                        priority: i + 1,
                        isPrimary: i === 0
                    }))
                }
            },
            include: { codes: true }
        });

        // 🔹 Log audit
        await logAudit(prisma, {
            action: "CREATE",
            resource: `Patient/${patient.id}`,
            user: c.get("userID") || "System",
            status: "success",
            details: "Registered new patient with demographic info"
        });

        return c.json({ message: "Patient registered successfully", patient });
    } catch (err) {
        await logAudit(prisma, {
            action: "CREATE",
            resource: `Patient/${patientId}`,
            user: c.get("userID") || "System",
            status: "error",
            details: "Failed to register patient"
        });
        return c.json({ error: "Failed to register patient" }, 500);
    }
});


VerifyRouter.post("/patient/:id/fhir-bundle", async (c) => {
    const prisma = (new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())) as any;
    const id = c.req.param("id");

    const patient = await prisma.patient.findUnique({
        where: { id },
        include: { codes: true }
    });

    if (!patient) return c.json({ error: "Patient not found" }, 404);

    const fhirBundle = {
        resourceType: "Bundle",
        type: "collection",
        entry: [
            {
                resource: {
                    resourceType: "Patient",
                    id: patient.id,
                    name: [{ given: [patient.givenName] }],
                    gender: patient.gender.toLowerCase(),
                    birthDate: patient.birthDate.toISOString().split("T")[0]
                }
            },
            ...patient.codes.map((code: { system: string; code: any; }) => ({
                resource: {
                    resourceType: "Condition",
                    code: {
                        coding: [
                            {
                                system: code.system === "ICD-11"
                                    ? "http://id.who.int/icd11/mms"
                                    : "http://namaste.health",
                                code: code.code,
                                display: code.code
                            }
                        ]
                    },
                    subject: { reference: `Patient/${patient.id}` }
                }
            }))
        ]
    };

    return c.json(fhirBundle);
});


let lastIngestCount = 0;

VerifyRouter.post("/ingest-csv", async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    const body = await c.req.parseBody();
    const file = body["file"] as File;
    if (!file) return c.json({ error: "No file uploaded" }, 400);

    const text = await file.text();
    const rows: any[] = [];
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    if (lines.length < 2) return c.json({ error: "CSV has no rows" }, 400);

    const headers = lines[0].split(",").map((h) => h.trim());
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const row: any = {};
        headers.forEach((h, idx) => {
            row[h] = values[idx] || null;
        });
        rows.push(row);
    }

    let success = 0;
    for (const row of rows) {
        try {
            await prisma.disease.create({
                data: {
                    namasteCode: row.namasteCode || row.code || null,
                    icd11Code: row.icd11Code || null,
                    description: row.description || row.display || row.definition || null,
                    source: "NAMASTE",
                },
            });
            success++;
        } catch (err) {
            console.error("❌ Insert failed", row, err);
        }
    }

    lastIngestCount = success; // 🔹 remember for codesystem

    return c.json({ message: `✅ Inserted ${success} rows successfully` });
});

VerifyRouter.get("/codesystem", async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    if (lastIngestCount === 0) {
        return c.json({ message: "No recent ingestion", concepts: [] });
    }

    const diseases = await prisma.disease.findMany({
        orderBy: { createdAt: "desc" },
        take: lastIngestCount,
    });

    const codeSystem = {
        resourceType: "CodeSystem",
        id: "namaste-codesystem",
        status: "active",
        content: "complete",
        concept: diseases.map((d: any) => ({
            code: d.namasteCode || d.icd11Code,
            display: d.description,
        })),
    };

    return c.json(codeSystem);
});

VerifyRouter.get("/codesystem/bundle", async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    if (lastIngestCount === 0) {
        return c.json({ message: "No recent ingestion", entry: [] });
    }

    const diseases = await prisma.disease.findMany({
        orderBy: { createdAt: "desc" },
        take: lastIngestCount,
    });

    const bundle = {
        resourceType: "Bundle",
        type: "collection",
        entry: diseases.map((d: any) => ({
            resource: {
                resourceType: "CodeSystem",
                id: d.id,
                content: "not-present",
                concept: [
                    {
                        code: d.namasteCode || d.icd11Code,
                        display: d.description,
                    },
                ],
            },
        })),
    };

    return c.json(bundle);
});


async function logAudit(prisma: any, {
    action,
    resource,
    user,
    status,
    details
}: {
    action: string;
    resource: string;
    user: string;
    status: string;
    details?: string;
}) {
    await prisma.auditEvent.create({
        data: { action, resource, user, status, details }
    });
}
