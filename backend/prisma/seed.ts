import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SUPPORTED_TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

const INITIAL_PRICES: Record<string, number> = {
  GOOG: 178.25,
  TSLA: 248.5,
  AMZN: 189.75,
  META: 528.3,
  NVDA: 1208.4,
};

async function main() {
  console.log("🌱 Seeding database...");

  // Seed stock prices
  for (const ticker of SUPPORTED_TICKERS) {
    await prisma.stockPrice.upsert({
      where: { ticker },
      update: {},
      create: {
        ticker,
        price: INITIAL_PRICES[ticker],
      },
    });
  }
  console.log("✅ Stock prices seeded");

  // Seed demo users
  const demoUsers = [
    { email: "alice@example.com", password: "password123" },
    { email: "bob@example.com", password: "password456" },
  ];

  for (const { email, password } of demoUsers) {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash },
    });
    console.log(`✅ User seeded: ${user.email}`);
  }

  console.log("🎉 Seeding complete!");
  console.log("─────────────────────────────────");
  console.log("Demo credentials:");
  console.log("  alice@example.com / password123");
  console.log("  bob@example.com   / password456");
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
