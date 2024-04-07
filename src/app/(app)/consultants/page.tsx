import { Suspense } from "react";

import Loading from "@/app/loading";
import ConsultantList from "@/components/consultants/ConsultantList";
import { getConsultantById, getConsultants } from "@/lib/api/consultants/queries";

import { checkAuth, getUserAuth } from "@/lib/auth/utils";
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
  const { session } = await getUserAuth();
  await checkAuth();

  const { consultants } = await getConsultants();
  const { staffs } = await getStaffs();

  const a = consultants.map(item => {
    if (item?.ConsultantStaff?.length > 0) {
      let arrayIdStaff = [] as string[]
      item?.ConsultantStaff.map(async rs => {
        console.log("userIdStaff:", rs?.userId)
        console.log("userId:", session?.user?.id)
        if (rs?.userId === session?.user?.id) {
          arrayIdStaff.push(rs.consultantId)
          await getConsultantById(arrayIdStaff)
        }

      })
    }
  })

  console.log("data", a)


  return (
    <Suspense fallback={<Loading />}>
      <ConsultantList consultants={consultants} staffs={staffs} />
    </Suspense>
  );
};
