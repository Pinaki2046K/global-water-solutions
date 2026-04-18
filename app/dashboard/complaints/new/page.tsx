import { prisma } from "@/lib/db";
import NewComplaintForm from "./NewComplaintForm";

export default async function NewComplaintPage() {
  const customers = await prisma.customer.findMany({
    select: { id: true, name: true, phone: true },
  });
  const services = await prisma.service.findMany({
    select: { id: true, customerId: true, serviceType: true },
  });

  return <NewComplaintForm customers={customers} services={services} />;
}
