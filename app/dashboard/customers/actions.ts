"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone number must be valid"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export async function createCustomer(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  };

  const validatedData = createCustomerSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      error: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.customer.create({
      data: {
        name: validatedData.data.name,
        address: validatedData.data.address,
        phone: validatedData.data.phone,
        email: validatedData.data.email || null,
      },
    });
  } catch (e) {
    console.error("Failed to create customer:", e);
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function getCustomers(query?: string) {
  return await prisma.customer.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { services: true, amcs: true },
      },
    },
  });
}
