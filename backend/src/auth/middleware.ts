import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken, JwtPayload } from "../utils/jwt";

// Extend Fastify types to include `user` on request
declare module "fastify" {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const token = request.cookies?.auth_token;
    if (!token) {
      return reply.status(401).send({ error: "Unauthorized: No token provided" });
    }
    const payload = verifyToken(token);
    request.user = payload;
  } catch {
    return reply.status(401).send({ error: "Unauthorized: Invalid or expired token" });
  }
}
