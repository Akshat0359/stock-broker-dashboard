import "dotenv/config";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import { Server as HttpServer } from "http";

import { authRoutes } from "./auth/routes";
import { stockRoutes } from "./stocks/routes";
import { initSocketIO } from "./websocket/handler";
import { initPrices, startPriceSimulator } from "./stocks/simulator";

// Render injects PORT dynamically; fall back to BACKEND_PORT for local dev
const PORT = parseInt(process.env.PORT ?? process.env.BACKEND_PORT ?? "4000", 10);
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

async function bootstrap() {
  const fastify = Fastify({ 
    logger: true,
    bodyLimit: 10240 // 10KB payload limit to prevent large payload DOS
  });

  // ─── Plugins ────────────────────────────────────────────────────────────
  await fastify.register(fastifyCors, {
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  });

  await fastify.register(fastifyCookie, {
    secret: process.env.JWT_SECRET ?? "cookie_secret",
  });

  await fastify.register(fastifyRateLimit, {
    max: 100, // 100 requests per minute globally
    timeWindow: "1 minute",
    keyGenerator: (req) => req.ip,
  });

  // ─── Routes ─────────────────────────────────────────────────────────────
  await fastify.register(authRoutes);
  await fastify.register(stockRoutes);

  // Health check
  fastify.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));

  // ─── HTTP Server + Socket.IO ─────────────────────────────────────────────
  // Fastify's .server is the underlying http.Server — pass it directly to Socket.IO
  initSocketIO(fastify.server as unknown as HttpServer, FRONTEND_URL);

  // ─── Start ───────────────────────────────────────────────────────────────
  await initPrices();

  await fastify.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`🚀 Backend running on http://localhost:${PORT}`);

  startPriceSimulator();
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
