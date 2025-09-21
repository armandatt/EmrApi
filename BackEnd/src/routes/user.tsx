import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

const userRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userID: string;
  };
}>();

userRoute.get("/me", async (c) => {
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

// Signup
userRoute.post("/signup", async (c) => {
  console.log("Request received");
  try {
    const { email, password, name } = await c.req.json<{ email: string; password: string; name: string }>();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password and name required" }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Store plain password (⚠️ no hashing)
    const user = await prisma.user.create({
      data: { name, email, password, role: "USER" },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!c.env.JWT_SECRET) {
      return c.json({ error: "Secret is missing" }, 500);
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    console.log("User created:", user);
    console.log("JWT:", token);

    return c.json({ message: "Signup successful", token, user });
  } catch (err) {
    console.error("Signup error:", err);
    return c.json({ error: "Something went wrong" }, 500);
  }
});



// Signin
userRoute.post("/signin", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const { email, password } = await c.req.json<{ email: string; password: string }>();

    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    // Compare raw password directly (⚠️ no hashing)
    if (user.password !== password) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    if (!c.env.JWT_SECRET) {
      return c.json({ error: "Secret is missing" }, 500);
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    console.log("User logged in:", user);
    console.log("JWT:", token);

    return c.json({ message: "Signin successful", token });
  } catch (err) {
    console.error("Signin error:", err);
    return c.json({ error: "Signin failed" }, 500);
  }
});

export default userRoute;
