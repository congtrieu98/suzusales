import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getContractById } from "@/lib/api/contracts/queries";
import { getConsultants } from "@/lib/api/consultants/queries";
import OptimisticContract from "@/app/(app)/contracts/[contractId]/OptimisticContract";
import { checkAuth } from "@/lib/auth/utils";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";

export const revalidate = 0;

export default async function ContractPage({
  params,
}: {
  params: { contractId: string };
}) {
  return (
    <main className="overflow-auto">
      <Contract id={params.contractId} />
    </main>
  );
}

const Contract = async ({ id }: { id: string }) => {
  await checkAuth();

  const { contract } = await getContractById(id);
  const { consultants } = await getConsultants();

  if (!contract) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="contracts" />
        <OptimisticContract
          contract={contract}
          consultants={consultants}
          consultantId={contract.consultantId}
        />
      </div>
    </Suspense>
  );
};
