import { Suspense } from "react";

import Loading from "@/app/loading";
import ConsultantList from "@/components/consultants/ConsultantList";
import {
  getConsultantByIds,
  getConsultants,
} from "@/lib/api/consultants/queries";

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

  let arrayIdStaff = [] as string[];
  consultants.map((item) => {
    if (item?.ConsultantStaff?.length > 0) {
      item?.ConsultantStaff.map((rs) => {
        if (rs?.email === session?.user?.email) {
          arrayIdStaff.push(rs.consultantId);
        }
      });
    }
  });
  const consutanByUser = await getConsultantByIds(arrayIdStaff);

  return (
    <Suspense fallback={<Loading />}>
      <ConsultantList
        //@ts-ignore
        consultants={
          session?.user?.role === "ADMIN" ? consultants : consutanByUser
        }
        staffs={staffs}
      />
    </Suspense>
  );
};
