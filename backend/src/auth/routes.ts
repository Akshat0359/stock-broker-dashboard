import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { signToken } from "../utils/jwt";
import { authenticate } from "./middleware";

const prisma = new PrismaClient();

const authBodySchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // "none" required when frontend (Netlify) and backend (Render) are on different origins.
  // Must be paired with secure:true in production.
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "strict") as "none" | "strict",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
};

export async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/register
  fastify.post(
    "/auth/register",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = authBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.errors[0].message });
      }

      const { email, password } = parsed.data;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return reply.status(409).send({ error: "Email already in use" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, passwordHash },
      });

      const token = signToken({ userId: user.id, email: user.email });
      reply.setCookie("auth_token", token, COOKIE_OPTIONS);

      return reply.status(201).send({
        user: { id: user.id, email: user.email },
      });
    }
  );

  // POST /auth/login
  fastify.post(
    "/auth/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = authBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.errors[0].message });
      }

      const { email, password } = parsed.data;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      const token = signToken({ userId: user.id, email: user.email });
      reply.setCookie("auth_token", token, COOKIE_OPTIONS);

      return reply.send({ user: { id: user.id, email: user.email } });
    }
  );

  // POST /auth/logout
  fastify.post(
    "/auth/logout",
    async (_request: FastifyRequest, reply: FastifyReply) => {
      // MUST pass the same SameSite + Secure + Path that were used when setting
      // the cookie. Without these, the browser treats it as a different cookie
      // and leaves the original auth_token alive — causing auto-login on refresh.
      reply.clearCookie("auth_token", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: (process.env.NODE_ENV === "production" ? "none" : "strict") as "none" | "strict",
      });
      return reply.send({ message: "Logged out successfully" });
    }
  );

  // GET /auth/me
  fastify.get(
    "/auth/me",
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId, email } = request.user!;
      return reply.send({ user: { id: userId, email } });
    }
  );
}
