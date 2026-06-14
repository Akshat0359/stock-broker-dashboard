import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../auth/middleware";
import { SUPPORTED_TICKERS, isSupportedTicker } from "../utils/tickers";
import { getCurrentPrices } from "./simulator";

const prisma = new PrismaClient();

const tickerSchema = z.object({
  ticker: z.string().refine(isSupportedTicker, {
    message: `Ticker must be one of: ${SUPPORTED_TICKERS.join(", ")}`,
  }),
});

export async function stockRoutes(fastify: FastifyInstance) {
  // GET /stocks — list all supported tickers with current prices
  fastify.get(
    "/stocks",
    { preHandler: authenticate },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const prices = getCurrentPrices();
      const stocks = SUPPORTED_TICKERS.map((ticker) => ({
        ticker,
        price: prices[ticker] ?? 0,
      }));
      return reply.send({ stocks });
    }
  );

  // GET /stocks/subscriptions — get user's subscriptions with current prices
  fastify.get(
    "/stocks/subscriptions",
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.user!;
      const prices = getCurrentPrices();

      const subscriptions = await prisma.subscription.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });

      const result = subscriptions.map((sub) => ({
        ticker: sub.ticker,
        price: prices[sub.ticker] ?? 0,
      }));

      return reply.send({ subscriptions: result });
    }
  );

  // POST /stocks/subscribe — subscribe to a ticker
  fastify.post(
    "/stocks/subscribe",
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.user!;

      const parsed = tickerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.errors[0].message });
      }

      const { ticker } = parsed.data;

      try {
        await prisma.subscription.create({
          data: { userId, ticker },
        });
      } catch (err: unknown) {
        // Unique constraint violation — already subscribed
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code: string }).code === "P2002"
        ) {
          return reply.status(409).send({ error: "Already subscribed to this ticker" });
        }
        throw err;
      }

      const prices = getCurrentPrices();
      return reply.status(201).send({
        message: `Subscribed to ${ticker}`,
        ticker,
        price: prices[ticker] ?? 0,
      });
    }
  );

  // DELETE /stocks/unsubscribe — unsubscribe from a ticker
  fastify.delete(
    "/stocks/unsubscribe",
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.user!;

      const parsed = tickerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.errors[0].message });
      }

      const { ticker } = parsed.data;

      const deleted = await prisma.subscription.deleteMany({
        where: { userId, ticker },
      });

      if (deleted.count === 0) {
        return reply.status(404).send({ error: "Subscription not found" });
      }

      return reply.send({ message: `Unsubscribed from ${ticker}`, ticker });
    }
  );
}
