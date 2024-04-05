import { db } from "@/lib/db/index";
import {
  ConsultantStafId,
  NewConsultantStafParams,
  UpdateConsultantStafParams,
  updateConsultantStafSchema,
  insertConsultantStafSchema,
  consultantStafIdSchema,
} from "@/lib/db/schema/consultantStaff";

export const createConsultantStaf = async (
  consultantStaf: NewConsultantStafParams
) => {
  const newConsultantStaf = insertConsultantStafSchema.parse(consultantStaf);
  try {
    const c = await db.consultantStaff.create({ data: newConsultantStaf });
    return { consultantStaf: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateConsultantStaf = async (
  id: ConsultantStafId,
  consultantStaf: UpdateConsultantStafParams
) => {
  const { id: consultantStafId } = consultantStafIdSchema.parse({ id });
  const newConsultantStaf = updateConsultantStafSchema.parse(consultantStaf);
  try {
    const c = await db.consultantStaff.update({
      where: { id: consultantStafId },
      data: newConsultantStaf,
    });
    return { consultantStaf: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteConsultantStaf = async (id: ConsultantStafId) => {
  const { id: consultantStafId } = consultantStafIdSchema.parse({ id });
  try {
    const c = await db.consultantStaff.delete({
      where: { id: consultantStafId },
    });
    return { consultantStaf: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};
