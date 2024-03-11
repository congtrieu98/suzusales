import { Suspense } from "react";

import Loading from "@/app/loading";
import StaffList from "@/components/staffs/StaffList";
import { getStaffs } from "@/lib/api/staffs/queries";


export const revalidate = 0;

export default async function StaffsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Staffs</h1>
        </div>
        <Staffs />
      </div>
    </main>
  );
}

const Staffs = async () => {
  
  const { staffs } = await getStaffs();
  
  return (
    <Suspense fallback={<Loading />}>
      <StaffList staffs={staffs}  />
    </Suspense>
  );
};
