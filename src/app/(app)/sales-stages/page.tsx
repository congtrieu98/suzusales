import { Suspense } from "react";

import Loading from "@/app/loading";
import SalesStageList from "@/components/salesStages/SalesStageList";
import { getSalesStages } from "@/lib/api/salesStages/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function SalesStagesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Sales Stages</h1>
        </div>
        <SalesStages />
      </div>
    </main>
  );
}

const SalesStages = async () => {
  await checkAuth();

  const { salesStages } = await getSalesStages();
  
  return (
    <Suspense fallback={<Loading />}>
      <SalesStageList salesStages={salesStages}  />
    </Suspense>
  );
};
