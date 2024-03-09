import { Suspense } from "react";

import Loading from "@/app/loading";
import ContractList from "@/components/contracts/ContractList";
import { getContracts } from "@/lib/api/contracts/queries";
import { getConsultants } from "@/lib/api/consultants/queries";
import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ContractsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Contracts</h1>
        </div>
        <Contracts />
      </div>
    </main>
  );
}

const Contracts = async () => {
  await checkAuth();

  const { contracts } = await getContracts();
  const { consultants } = await getConsultants();
  return (
    <Suspense fallback={<Loading />}>
      {/* <ContractList contracts={contracts} consultants={consultants} /> */}
    </Suspense>
  );
};
