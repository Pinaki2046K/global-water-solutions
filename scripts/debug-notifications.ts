import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Debugging notification system...\n");

  // 1. Check admin users
  console.log("--- STEP 1: Checking Admin Users ---");
  const adminUsers = await prisma.user.findMany({
    where: { role: "admin" },
  });
  console.log(`Found ${adminUsers.length} admin users:`);
  adminUsers.forEach((u) => {
    console.log(`  - ${u.name} (${u.email}) - Role: ${u.role}`);
  });

  if (adminUsers.length === 0) {
    console.log("⚠️  NO ADMIN USERS FOUND! Creating one...");
    const newAdmin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        emailVerified: true,
      },
    });
    console.log(`✅ Created admin: ${newAdmin.email}`);
  }
  console.log();

  // 2. Check test services
  console.log("--- STEP 2: Checking Test Services ---");
  const testServices = await prisma.service.findMany({
    include: {
      customer: true,
    },
  });
  console.log(`Found ${testServices.length} total services`);

  // Show services with past due dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const duServices = testServices.filter((s) => s.nextServiceDueDate <= today);
  console.log(`\nServices due for maintenance (nextServiceDueDate <= today):`);
  duServices.forEach((s) => {
    console.log(`  - Customer: ${s.customer.name}`);
    console.log(`    Service Type: ${s.serviceType}`);
    console.log(`    Installation: ${s.installationDate.toDateString()}`);
    console.log(`    Next Due: ${s.nextServiceDueDate.toDateString()}`);
    console.log();
  });

  if (duServices.length === 0) {
    console.log("⚠️  NO SERVICES DUE! Showing all services:");
    testServices.forEach((s) => {
      console.log(
        `  - ${s.customer.name}: Next Due: ${s.nextServiceDueDate.toDateString()}`,
      );
    });
  }
  console.log();

  // 3. Check existing notifications
  console.log("--- STEP 3: Checking Existing Notifications ---");
  const notifications = await prisma.notification.findMany({
    include: {
      user: true,
    },
  });
  console.log(`Found ${notifications.length} total notifications`);
  notifications.forEach((n) => {
    console.log(`  - To: ${n.user.email}`);
    console.log(`    Title: ${n.title}`);
    console.log(`    Message: ${n.message}`);
    console.log(`    Read: ${n.isRead}`);
    console.log();
  });

  // 4. Manually trigger notification creation
  console.log("--- STEP 4: Manually Creating Notifications ---");
  const admin =
    adminUsers[0] ||
    (await prisma.user.findFirst({ where: { role: "admin" } }));

  if (admin && duServices.length > 0) {
    console.log(`Creating notifications for admin: ${admin.email}`);

    for (const service of duServices) {
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: admin.id,
          title: "SERVICE DUE FOR MAINTENANCE",
          message: {
            contains: service.id,
          },
        },
      });

      if (!existingNotification) {
        const notification = await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "SERVICE DUE FOR MAINTENANCE",
            message: `Service for customer "${service.customer.name}" (${service.serviceType}) is due for maintenance.`,
            type: "WARNING",
            isRead: false,
          },
        });
        console.log(`✅ Created notification: ${notification.message}`);
      } else {
        console.log(
          `⚠️  Notification already exists for service ${service.id}`,
        );
      }
    }
  }

  console.log("\n✅ Debug complete!");
}

main()
  .catch((e) => {
    console.error("❌ Fatal Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
