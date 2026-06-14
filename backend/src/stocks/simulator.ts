import { PrismaClient } from "@prisma/client";
import { SUPPORTED_TICKERS } from "../utils/tickers";
import { broadcastPriceUpdate } from "../websocket/handler";

const prisma = new PrismaClient();

// In-memory current prices for fast access
const currentPrices: Record<string, number> = {};

const INITIAL_PRICES: Record<string, number> = {
  GOOG: 178.25,
  TSLA: 248.5,
  AMZN: 189.75,
  META: 528.3,
  NVDA: 1208.4,
};

// Max ±0.5% change per tick
const MAX_CHANGE_PERCENT = 0.005;

export async function initPrices() {
  for (const ticker of SUPPORTED_TICKERS) {
    const record = await prisma.stockPrice.findUnique({ where: { ticker } });
    currentPrices[ticker] = record?.price ?? INITIAL_PRICES[ticker];
  }
  console.log("✅ Initial prices loaded:", currentPrices);
}

export function getCurrentPrices(): Record<string, number> {
  return { ...currentPrices };
}

export function startPriceSimulator() {
  setInterval(async () => {
    const updates: { ticker: string; price: number }[] = [];

    for (const ticker of SUPPORTED_TICKERS) {
      const current = currentPrices[ticker];
      const changePercent = (Math.random() * 2 - 1) * MAX_CHANGE_PERCENT;
      const newPrice = parseFloat((current * (1 + changePercent)).toFixed(2));
      currentPrices[ticker] = newPrice;
      updates.push({ ticker, price: newPrice });
    }

    // Persist to DB and broadcast concurrently
    await Promise.all([
      ...updates.map(({ ticker, price }) =>
        prisma.stockPrice.upsert({
          where: { ticker },
          update: { price },
          create: { ticker, price },
        })
      ),
      ...updates.map(({ ticker, price }) => broadcastPriceUpdate(ticker, price)),
    ]);
  }, 1000);

  console.log("✅ Price simulator started (1s interval)");
}
