import { Suspense } from "react";

import Loading from "@/app/loading";
import CardStageList from "@/components/cardStages/CardStageList";
import { getCardStages } from "@/lib/api/cardStages/queries";


export const revalidate = 0;

export default async function CardStagesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Card Stages</h1>
        </div>
        <CardStages />
      </div>
    </main>
  );
}

const CardStages = async () => {
  
  const { cardStages } = await getCardStages();
  
  return (
    <Suspense fallback={<Loading />}>
      <CardStageList cardStages={cardStages}  />
    </Suspense>
  );
};
