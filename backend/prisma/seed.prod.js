// Production seed script — safe to run multiple times (upsert is idempotent)
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const p = new PrismaClient();

(async () => {
  try {
    const h1 = await bcrypt.hash("password123", 12);
    const h2 = await bcrypt.hash("password456", 12);

    await p.user.upsert({
      where:  { email: "alice@example.com" },
      update: {},
      create: { email: "alice@example.com", passwordHash: h1 },
    });

    await p.user.upsert({
      where:  { email: "bob@example.com" },
      update: {},
      create: { email: "bob@example.com", passwordHash: h2 },
    });

    console.log("✅ Seeded demo users: alice@example.com, bob@example.com");
  } finally {
    await p.$disconnect();
  }
})().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
