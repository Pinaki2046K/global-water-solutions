import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("📊 Verification Report\n");

  // Get all notifications for test customer
  const notifications = await prisma.notification.findMany({
    where: {
      title: "SERVICE DUE FOR MAINTENANCE",
      message: {
        contains: "Test Customer For Notifications",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(
    `Found ${notifications.length} notifications for "Test Customer For Notifications"\n`,
  );

  notifications.forEach((n, index) => {
    console.log(`Notification ${index + 1}:`);
    console.log(`  Message: ${n.message}`);
    console.log(`  Read: ${n.isRead}`);
    console.log(`  Created: ${n.createdAt.toISOString()}`);
    console.log();
  });

  if (notifications.length === 3) {
    console.log("✅ SUCCESS! All 3 services have separate notifications.");
    console.log("   - 1st Service Cycle (Oct 17)");
    console.log("   - 2nd Service Cycle (Jul 17)");
    console.log("   - 3rd Service Cycle (Apr 17)");
  } else {
    console.log(`⚠️  Expected 3 notifications, found ${notifications.length}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Fatal Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
