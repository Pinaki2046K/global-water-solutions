import "dotenv/config";
import fs from "fs";
import { parse } from "csv-parse/sync";
import {
  PrismaClient,
  ComplaintStatus,
  PaymentStatus,
} from "../generated/prisma/client";
import { parse as parseDate } from "date-fns";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper to parse "dd.MM.yyyy"
function parseCustomDate(dateStr: string): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  try {
    const d = parseDate(dateStr.trim(), "dd.MM.yyyy", new Date());
    if (isNaN(d.getTime())) return null;
    return d;
  } catch {
    console.warn(`Failed to parse date: ${dateStr}`);
    return null;
  }
}

function cleanPhone(phone: string): string {
  return phone ? phone.replace(/[^\d+]/g, "").trim() : "";
}

async function main() {
  console.log("🚀 Starting Service Calls Import...");

  const rawFile = fs.readFileSync("service_call_raw.csv", "utf-8");
  // Skip the first line (col_1, col_2...)
  const lines = rawFile.split(/\r?\n/);
  const cleanCsv = lines.slice(1).join("\n");

  const records = parse(cleanCsv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<Record<string, string>>;

  console.log(`📂 Found ${records.length} records to process.`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const row of records) {
    const name = row["Name"];
    const dateStr = row["Date"];
    const issue = row["Issue"];
    const phoneRaw = row["phone number"];
    const address = row["Address"];
    const workComplete = row["Work Complete"]; // 'Yes' or empty/other
    const paidAmountStr = row["Paid Amount"];
    const paymentModeStr = row["G pay Or Cash"];

    if (!name) {
      // console.log(`⚠️  Skipping row with missing name`);
      skippedCount++;
      continue;
    }

    const phone = cleanPhone(phoneRaw);

    // 1. Find or Create Customer
    let customer;
    if (phone) {
      customer = await prisma.customer.findFirst({
        where: { phone: { contains: phone } },
      });
    }

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: name,
          address: address || "Unknown Address",
          phone: phone || "Unknown",
          email: "",
        },
      });
    }

    // 2. Find Service or Create Placeholder
    let service = await prisma.service.findFirst({
      where: { customerId: customer.id },
    });

    if (!service) {
      // Create Placeholder "General System"
      // Since we don't know when it was installed, default to Now or the Complaint Date
      const complaintDate = parseCustomDate(dateStr) || new Date();
      service = await prisma.service.create({
        data: {
          customerId: customer.id,
          serviceType: "General System (Legacy)",
          installationDate: complaintDate || new Date(),
        },
      });
    }

    // 3. Create Complaint
    const status =
      workComplete && workComplete.toLowerCase() === "yes"
        ? ComplaintStatus.RESOLVED
        : ComplaintStatus.OPEN;

    const createdAt = parseCustomDate(dateStr) || new Date();

    await prisma.complaint.create({
      data: {
        customerId: customer.id,
        serviceId: service.id,
        description: issue || "No description provided",
        status: status,
        createdAt: createdAt,
        // technicianId is left null as per CSV data not having tech info
      },
    });

    // 4. Create Payment if "Paid Amount" is present
    const amount = parseFloat(paidAmountStr?.replace(/[^0-9.]/g, "") || "0");
    if (amount > 0) {
      await prisma.payment.create({
        data: {
          customerId: customer.id,
          amount: amount,
          status: PaymentStatus.PAID,
          paymentMode: paymentModeStr || "CASH", // Default to CASH if unspecified
          paymentDate: createdAt,
        },
      });
    }

    createdCount++;
    process.stdout.write(`\r✅ Processed: ${createdCount}/${records.length}`);
  }

  console.log("\n");
  console.log(`🎉 Import Complete!`);
  console.log(`   Processed: ${createdCount}`);
  console.log(`   Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Fatal Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
