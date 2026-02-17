import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔄 Resetting notifications...\n");

  // Delete all existing service notifications
  const deleted = await prisma.notification.deleteMany({
    where: {
      title: "SERVICE DUE FOR MAINTENANCE",
    },
  });

  console.log(`✅ Deleted ${deleted.count} existing service notifications`);
  console.log("\n📝 Now refresh your dashboard to re-create notifications for all due services.");
  console.log("   The system will create 1 notification per service.");
}

main()
  .catch((e) => {
    console.error("❌ Fatal Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
