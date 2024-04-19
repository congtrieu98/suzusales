import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCardStageById } from "@/lib/api/cardStages/queries";
import OptimisticCardStage from "./OptimisticCardStage";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CardStagePage({
  params,
}: {
  params: { cardStageId: string };
}) {

  return (
    <main className="overflow-auto">
      <CardStage id={params.cardStageId} />
    </main>
  );
}

const CardStage = async ({ id }: { id: string }) => {
  
  const { cardStage } = await getCardStageById(id);
  

  if (!cardStage) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="card-stages" />
        <OptimisticCardStage cardStage={cardStage}  />
      </div>
    </Suspense>
  );
};
