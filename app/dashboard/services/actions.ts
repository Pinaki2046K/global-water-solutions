"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createServiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  serviceType: z.string().min(1, "Service type is required"),
  serviceRegisterDate: z.string().optional(),
  serviceCompleteDate: z.string().optional(),
});

export async function createService(formData: FormData) {
  const customerId = formData.get("customerId") as string;
  const serviceType = formData.get("serviceType") as string;
  const serviceRegisterDate = formData.get("serviceRegisterDate") as string;
  const serviceCompleteDate = formData.get("serviceCompleteDate") as string;

  const validatedData = createServiceSchema.safeParse({
    customerId,
    serviceType,
    serviceRegisterDate,
    serviceCompleteDate,
  });

  if (!validatedData.success) {
    return {
      error: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.service.create({
      data: {
        customerId: validatedData.data.customerId,
        serviceType: validatedData.data.serviceType,
        serviceRegisterDate: validatedData.data.serviceRegisterDate
          ? new Date(validatedData.data.serviceRegisterDate)
          : new Date(),
        serviceCompleteDate: validatedData.data.serviceCompleteDate
          ? new Date(validatedData.data.serviceCompleteDate)
          : null,
      },
    });
  } catch (e) {
    console.error("Failed to create service:", e);
    return {
      message: "Database Error: Failed to Create Service.",
    };
  }

  revalidatePath("/dashboard/services");
  redirect("/dashboard/services");
}
