import { prisma } from "@/lib/db";
import NewPaymentForm from "./NewPaymentForm";

export default async function NewPaymentPage() {
  const customers = await prisma.customer.findMany({
    select: { id: true, name: true, phone: true },
  });
  const amcs = await prisma.aMCContract.findMany({
    select: {
      id: true,
      customerId: true,
      service: { select: { serviceType: true } },
    },
  });

  return <NewPaymentForm customers={customers} amcs={amcs} />;
}
