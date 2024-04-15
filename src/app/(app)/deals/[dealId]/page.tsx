import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getDealById } from "@/lib/api/deals/queries";
import OptimisticDeal from "./OptimisticDeal";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function DealPage({
  params,
}: {
  params: { dealId: string };
}) {

  return (
    <main className="overflow-auto">
      <Deal id={params.dealId} />
    </main>
  );
}

const Deal = async ({ id }: { id: string }) => {
  await checkAuth();

  const { deal } = await getDealById(id);
  

  if (!deal) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="deals" />
        <OptimisticDeal deal={deal}  />
      </div>
    </Suspense>
  );
};
