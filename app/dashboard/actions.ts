"use server";

import { prisma } from "@/lib/db";
import { $Enums } from "@/generated/prisma/client";

export async function getDashboardStats() {
  const [totalCustomers, activeAMCs, pendingAMCsCount, openComplaintsCount] =
    await Promise.all([
      prisma.customer.count(),
      prisma.aMCContract.count({
        where: {
          status: $Enums.AMCStatus.ACTIVE,
        },
      }),
      prisma.aMCContract.count({
        where: {
          status: $Enums.AMCStatus.PENDING_PAYMENT,
        },
      }),
      prisma.complaint.count({
        where: {
          status: $Enums.ComplaintStatus.OPEN,
        },
      }),
    ]);

  // Calculate pending amount from pending AMCs
  const pendingAMCs = await prisma.aMCContract.findMany({
    where: { status: $Enums.AMCStatus.PENDING_PAYMENT },
    select: { amount: true },
  });
  const pendingAmount = pendingAMCs.reduce((sum, amc) => sum + amc.amount, 0);

  return {
    totalCustomers,
    activeAMCs,
    pendingAMCsCount,
    pendingAmount,
    openComplaintsCount,
  };
}

export async function getExpiringAMCs() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const now = new Date();

  return await prisma.aMCContract.findMany({
    where: {
      status: $Enums.AMCStatus.ACTIVE,
      endDate: {
        lte: thirtyDaysFromNow,
        gte: now,
      },
    },
    take: 5,
    orderBy: {
      endDate: "asc",
    },
    include: {
      customer: true,
      service: true,
    },
  });
}

export async function getRecentComplaints() {
  return await prisma.complaint.findMany({
    where: {
      status: {
        in: [$Enums.ComplaintStatus.OPEN, $Enums.ComplaintStatus.IN_PROGRESS],
      },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      service: true,
    },
  });
}

export async function getMonthlyRevenue() {
  // Fetch last 6 months payments
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const payments = await prisma.financeLog.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
      type: "INCOME",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Aggregate by month
  const monthlyData: Record<string, number> = {};
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize last 6 months to ensure we have data points even if they are 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
    monthlyData[key] = 0;
  }

  payments.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
    if (monthlyData[key] !== undefined) {
      monthlyData[key] += p.amount;
    }
  });

  return Object.entries(monthlyData).map(([name, total]) => ({ name, total }));
}
