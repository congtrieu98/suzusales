import { Suspense } from "react";

import Loading from "@/app/loading";
import DealList from "@/components/deals/DealList";
import { getDeals } from "@/lib/api/deals/queries";

import { checkAuth } from "@/lib/auth/utils";
import { getCompanies } from "@/lib/api/companies/queries";
import { getUsers } from "@/lib/api/users/queries";
import { getSalesStages } from "@/lib/api/salesStages/queries";

export const revalidate = 0;

export default async function DealsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Deals</h1>
        </div>
        <Deals />
      </div>
    </main>
  );
}

const Deals = async () => {
  await checkAuth();

  const { deals } = await getDeals();
  const { companies } = await getCompanies();
  const { users } = await getUsers();
  const { salesStages } = await getSalesStages();

  return (
    <Suspense fallback={<Loading />}>
      <DealList deals={deals} companies={companies} users={users} salesStages={salesStages} />
    </Suspense>
  );
};
