import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getSalesStageById } from "@/lib/api/salesStages/queries";
import OptimisticSalesStage from "./OptimisticSalesStage";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function SalesStagePage({
  params,
}: {
  params: { salesStageId: string };
}) {

  return (
    <main className="overflow-auto">
      <SalesStage id={params.salesStageId} />
    </main>
  );
}

const SalesStage = async ({ id }: { id: string }) => {
  await checkAuth();

  const { salesStage } = await getSalesStageById(id);
  

  if (!salesStage) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="sales-stages" />
        <OptimisticSalesStage salesStage={salesStage}  />
      </div>
    </Suspense>
  );
};
