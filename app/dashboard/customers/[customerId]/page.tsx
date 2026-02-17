import { notFound } from "next/navigation";
import { getCustomerDetails } from "./actions";

import ClientPage from "./client-page";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  // Await params (Next.js 15+ requirement)
  const { customerId } = await params;
  const customer = await getCustomerDetails(customerId);

  if (!customer) {
    notFound();
  }

  return (
    <ClientPage
      customer={{
        ...customer,
        payments: customer.payments.map((payment) => ({
          ...payment,
          amcId: payment.amcId ?? undefined,
        })),
      }}
    />
  );
}
