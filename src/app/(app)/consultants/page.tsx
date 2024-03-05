import { Suspense } from "react";

import Loading from "@/app/loading";
import ConsultantList from "@/components/consultants/ConsultantList";
import { getConsultants } from "@/lib/api/consultants/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function ConsultantsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Consultants</h1>
        </div>
        <Consultants />
      </div>
    </main>
  );
}

const Consultants = async () => {
  await checkAuth();

  const { consultants } = await getConsultants();
  
  return (
    <Suspense fallback={<Loading />}>
      <ConsultantList consultants={consultants}  />
    </Suspense>
  );
};
