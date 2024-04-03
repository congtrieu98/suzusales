import { Suspense } from "react";

import Loading from "@/app/loading";
import ConsultantList from "@/components/consultants/ConsultantList";
import { getConsultants } from "@/lib/api/consultants/queries";

import { checkAuth } from "@/lib/auth/utils";
import { getStaffs } from "@/lib/api/staffs/queries";

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
  const { staffs } = await getStaffs();

  return (
    <Suspense fallback={<Loading />}>
      <ConsultantList consultants={consultants} staffs={staffs} />
    </Suspense>
  );
};
