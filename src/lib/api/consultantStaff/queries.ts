import { db } from "@/lib/db/index";
import {
  type ConsultantStafId,
  consultantStafIdSchema,
} from "@/lib/db/schema/consultantStaff";

export const getConsultantStaffs = async () => {
  const c = await db.consultantStaff.findMany({});
  return { consultantStaff: c };
};

export const getConsultantStafById = async (id: ConsultantStafId) => {
  const { id: consultantStafId } = consultantStafIdSchema.parse({ id });
  const c = await db.consultantStaff.findFirst({
    where: { id: consultantStafId },
  });
  return { consultantStaff: c };
};
