import "dotenv/config";
import {
  PrismaClient,
  AMCStatus,
  PaymentStatus,
} from "../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding realistic test data for notification system...\n");

  // 1. Get or create admin user
  let adminUser = await prisma.user.findFirst({
    where: { role: "admin" },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        emailVerified: true,
      },
    });
    console.log("✅ Created admin user:", adminUser.email);
  } else {
    console.log("✅ Using existing admin user:", adminUser.email);
  }

  // 2. Create test customer
  const testCustomer = await prisma.customer.create({
    data: {
      name: "Test Customer For Notifications",
      phone: "9999999999",
      address: "123 Test Street, Test City",
      email: "testcustomer@example.com",
    },
  });

  console.log("✅ Created test customer:", testCustomer.name);
  console.log();

  // 3. Create 3 test services for each 3-month service cycle completion
  const testCases = [
    {
      name: "Case 1: Crossed 1st Service Date (3 months)",
      installationMonthsAgo: 4,
      nextDueMonthsAgo: 1,
      serviceType: "Air Conditioner - 2 Ton (1st Service Cycle)",
    },
    {
      name: "Case 2: Crossed 2nd Service Date (6 months)",
      installationMonthsAgo: 7,
      nextDueMonthsAgo: 1,
      serviceType: "Air Conditioner - 1.5 Ton (2nd Service Cycle)",
    },
    {
      name: "Case 3: Crossed 3rd Service Date (9 months)",
      installationMonthsAgo: 10,
      nextDueMonthsAgo: 1,
      serviceType: "Air Conditioner - 1 Ton (3rd Service Cycle)",
    },
  ];

  for (const testCase of testCases) {
    // Calculate dates based on months ago
    const installationDate = new Date();
    installationDate.setMonth(
      installationDate.getMonth() - testCase.installationMonthsAgo,
    );

    const nextServiceDueDate = new Date();
    nextServiceDueDate.setMonth(
      nextServiceDueDate.getMonth() - testCase.nextDueMonthsAgo,
    );

    // Create service
    const service = await prisma.service.create({
      data: {
        customerId: testCustomer.id,
        serviceType: testCase.serviceType,
        installationDate: installationDate,
        nextServiceDueDate: nextServiceDueDate,
      },
    });

    // Create AMC contract
    const amcStartDate = new Date(installationDate);
    const amcEndDate = new Date(amcStartDate);
    amcEndDate.setFullYear(amcEndDate.getFullYear() + 1); // 1 year warranty

    const amc = await prisma.aMCContract.create({
      data: {
        customerId: testCustomer.id,
        serviceId: service.id,
        startDate: amcStartDate,
        endDate: amcEndDate,
        renewalDate: amcEndDate,
        amount: 50000,
        status: AMCStatus.ACTIVE,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        customerId: testCustomer.id,
        amcId: amc.id,
        amount: 50000,
        status: PaymentStatus.PAID,
        paymentMode: "CASH",
        paymentDate: installationDate,
      },
    });

    console.log(`✅ ${testCase.name}`);
    console.log(`   📦 Service Type: ${testCase.serviceType}`);
    console.log(`   📅 Installation Date: ${installationDate.toDateString()}`);
    console.log(`   ⏰ Next Service Due: ${nextServiceDueDate.toDateString()}`);
    console.log(`   💰 AMC Amount: ₹50,000`);
    console.log();
  }

  console.log("🎉 Test data seeded successfully!");
  console.log(
    "📝 When you open the dashboard, all 3 services will trigger maintenance notifications.\n",
  );
  console.log("Expected Result:");
  console.log("  ✓ Bell icon shows unread count (3)");
  console.log(
    "  ✓ 3 'SERVICE DUE FOR MAINTENANCE' notifications appear (one for each case)",
  );
  console.log("  ✓ Each notification shows the customer and service type");
}

main()
  .catch((e) => {
    console.error("❌ Fatal Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
