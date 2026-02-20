"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
};

export async function getUserNotifications() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return [];

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationAsRead(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  await prisma.notification.update({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  });

  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  return { success: true };
}

// Check for services due for servicing and create notifications
export async function checkAndCreateServiceNotifications() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  // Only admins can check service notifications
  if (session.user.role !== "admin") {
    return { error: "Only admins can view service notifications" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find all services where nextServiceDueDate is today or in the past
  const servicesDue = await prisma.service.findMany({
    where: {
      nextServiceDueDate: {
        lte: today,
      },
    },
    include: {
      customer: true,
    },
  });

  console.log(`📊 Found ${servicesDue.length} services due for maintenance`);

  if (servicesDue.length === 0) {
    return { count: 0, message: "No services due for servicing" };
  }

  // Create notifications for admin only
  const adminUsers = await prisma.user.findMany({
    where: {
      role: "admin",
    },
  });

  console.log(`👥 Found ${adminUsers.length} admin users`);

  let createdCount = 0;

  for (const service of servicesDue) {
    for (const admin of adminUsers) {
      // Check if notification already exists for this specific service
      // Use service ID to ensure each service gets its own notification
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: admin.id,
          title: "SERVICE DUE FOR MAINTENANCE",
          message: {
            contains: service.id, // Check for specific service ID
          },
          isRead: false,
        },
      });

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "SERVICE DUE FOR MAINTENANCE",
            message: `Service for customer "${service.customer.name}" (${service.serviceType}) is due for maintenance. [Service ID: ${service.id}]`,
            type: "WARNING",
            isRead: false,
          },
        });
        createdCount++;
      }
    }
  }

  console.log(`✅ Created ${createdCount} new notifications`);

  return {
    count: servicesDue.length,
    message: "Service notifications created",
  };
}

// Get notification with full service details
export async function getNotificationWithServiceDetails(
  notificationId: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  // Get the notification
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId, userId: session.user.id },
  });

  if (!notification) {
    return { error: "Notification not found" };
  }

  // Extract service ID from message using regex
  const serviceIdMatch = notification.message.match(/\[Service ID: ([^\]]+)\]/);
  if (!serviceIdMatch) {
    return { error: "Service ID not found in notification" };
  }

  const serviceId = serviceIdMatch[1];

  // Get full service details with customer, AMC, and payment info
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      customer: true,
      amcContracts: {
        include: {
          payments: true,
        },
      },
    },
  });

  if (!service) {
    return { error: "Service not found" };
  }

  return {
    notification,
    service: {
      id: service.id,
      serviceType: service.serviceType,
      installationDate: service.installationDate,
      nextServiceDueDate: service.nextServiceDueDate,
      customer: service.customer,
      amcContracts: service.amcContracts,
    },
  };
}

// Mark a service as serviced and reset the due date
export async function markServiceAsServiced(serviceId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  if (session.user.role !== "admin") {
    return { error: "Only admins can mark services as serviced" };
  }

  // Get the service to calculate which service cycle this is
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    return { error: "Service not found" };
  }

  // Calculate which service cycle this is based on installation date
  const monthsSinceInstallation = Math.floor(
    (new Date().getTime() - new Date(service.installationDate).getTime()) /
      (1000 * 60 * 60 * 24 * 30),
  );

  // Determine service cycle (1st = 3 months, 2nd = 6 months, 3rd = 9 months, 4th = 12 months)
  const serviceCycle = Math.ceil(monthsSinceInstallation / 3);

  // Calculate next service due date (3 months from now)
  const nextDueDate = new Date();
  nextDueDate.setMonth(nextDueDate.getMonth() + 3);

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      nextServiceDueDate: nextDueDate,
    },
  });

  // Delete related notifications (remove from list since service is completed)
  await prisma.notification.deleteMany({
    where: {
      message: {
        contains: serviceId,
      },
    },
  });

  return {
    success: true,
    message: "Service marked as serviced",
    nextServiceDueDate: nextDueDate,
    serviceCycle: serviceCycle,
  };
}
