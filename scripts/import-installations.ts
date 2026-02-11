import "dotenv/config";
import fs from "fs";
import { parse } from "csv-parse/sync";
import {
  PrismaClient,
  AMCStatus,
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
  console.log("🚀 Starting Installations Import...");

  const rawFile = fs.readFileSync("new_installation_raw.csv", "utf-8");
  // Skip the first line (col_1, col_2...) which is garbage/metadata
  const lines = rawFile.split(/\r?\n/);
  const cleanCsv = lines.slice(1).join("\n");

  const records = parse(cleanCsv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  console.log(`📂 Found ${records.length} records to process.`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const row of records) {
    const name = row["Name"];
    const dateStr = row["Date"];
    const model = row["Model"];
    const capacity = row["Capacity"];
    const phoneRaw = row["phone number"];
    const address = row["Address"];
    const warrantyDateStr = row["Warranty Period"];
    const amountStr = row["Amount"];
    const paymentStatusStr = row["Payment Status"]; // Paid, Pending, etc.

    if (!name) {
      console.log(
        `⚠️  Skipping row with missing name (Row SN: ${row["Sn.no"]})`,
      );
      skippedCount++;
      continue;
    }

    const phone = cleanPhone(phoneRaw);

    // 1. Find or Create Customer
    let customer;
    if (phone) {
      customer = await prisma.customer.findFirst({
        where: { phone: { contains: phone } }, // Loose match preferred
      });
    }

    if (!customer) {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          name: name,
          address: address || "Unknown Address",
          phone: phone || "Unknown", // Handle missing phone if needed
          email: "", // CSV doesn't seem to have email
        },
      });
    } else {
      // Optionally update address if missing?
      // keeping it simple for now
    }

    // 2. Create Service (Installation)
    const installDate = parseCustomDate(dateStr) || new Date();
    const serviceType = `${model || "Standard"} - ${capacity || ""}`.trim();

    const service = await prisma.service.create({
      data: {
        customerId: customer.id,
        serviceType: serviceType,
        installationDate: installDate,
      },
    });

    // 3. Create Payment record if Amount is present
    const amount = parseFloat(amountStr?.replace(/[^0-9.]/g, "") || "0");
    if (amount > 0) {
      // Determine payment status enum
      let status: PaymentStatus = PaymentStatus.PENDING;
      if (paymentStatusStr?.toLowerCase() === "paid") {
        status = PaymentStatus.PAID;
      } else if (paymentStatusStr?.toLowerCase() === "pending") {
        status = PaymentStatus.PENDING;
      }

      await prisma.payment.create({
        data: {
          customerId: customer.id,
          amount: amount,
          status: status,
          paymentMode: "CASH", // Defaulting to CASH as mode isn't clear in standard columns, or could be 'Pending'
          paymentDate: installDate, // Assuming payment date is same as install date for now
        },
      });
    }

    // 4. Create Warranty AMC if applicable
    const warrantyEnd = parseCustomDate(warrantyDateStr);
    if (warrantyEnd) {
      // Assuming warranty starts from installation date
      // status ACTIVE since it's a warranty period
      await prisma.aMCContract.create({
        data: {
          customerId: customer.id,
          serviceId: service.id,
          startDate: installDate,
          endDate: warrantyEnd,
          renewalDate: warrantyEnd, // Usually renewal is at end of contract
          amount: 0, // Warranty usually implies included cost, or we could parse 'Amount' column
          status: AMCStatus.ACTIVE,
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
