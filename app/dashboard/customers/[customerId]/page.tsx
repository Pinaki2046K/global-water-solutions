import { notFound } from "next/navigation";
import { getCustomerDetails } from "./actions";


import ClientPage from "./client-page";

export default async function CustomerDetailPage({
  params,
}: {
  params: { customerId: string };
}) {
  // Await params first (Next.js 15+ req but safe here)
  const resolvedParams = await params;
  const customer = await getCustomerDetails(resolvedParams.customerId);

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
