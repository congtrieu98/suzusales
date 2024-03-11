import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getStaffById } from "@/lib/api/staffs/queries";
import OptimisticStaff from "./OptimisticStaff";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function StaffPage({
  params,
}: {
  params: { staffId: string };
}) {

  return (
    <main className="overflow-auto">
      <Staff id={params.staffId} />
    </main>
  );
}

const Staff = async ({ id }: { id: string }) => {
  
  const { staff } = await getStaffById(id);
  

  if (!staff) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="staffs" />
        <OptimisticStaff staff={staff}  />
      </div>
    </Suspense>
  );
};
