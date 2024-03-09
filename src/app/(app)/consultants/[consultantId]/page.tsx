import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getConsultantByIdWithContracts } from "@/lib/api/consultants/queries";
import OptimisticConsultant from "./OptimisticConsultant";
import { checkAuth } from "@/lib/auth/utils";
import ContractList from "@/components/contracts/ContractList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ConsultantPage({
  params,
}: {
  params: { consultantId: string };
}) {

  return (
    <main className="overflow-auto">
      <Consultant id={params.consultantId} />
    </main>
  );
}

const Consultant = async ({ id }: { id: string }) => {
  await checkAuth();

  const { consultant, contracts } = await getConsultantByIdWithContracts(id);


  if (!consultant) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="consultants" />
        <OptimisticConsultant consultant={consultant} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{consultant.customerName}&apos;s Contracts</h3>
        <ContractList
          consultantStatus={consultant.status}
          consultants={[]}
          consultantId={consultant.id}
          contracts={contracts}
        />
      </div>
    </Suspense>
  );
};
