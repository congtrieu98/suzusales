import { db } from "@/lib/db/index";
import {
  ConsultantId,
  NewConsultantParams,
  UpdateConsultantParams,
  updateConsultantSchema,
  insertConsultantSchema,
  consultantIdSchema,
} from "@/lib/db/schema/consultants";
import { getUserAuth } from "@/lib/auth/utils";
import { Novu } from "@novu/node";

export const createConsultant = async (consultant: NewConsultantParams) => {
  const { session } = await getUserAuth();
  const newConsultant = insertConsultantSchema.parse({
    ...consultant,
    userId: session?.user.id!,
  });
  const novu = new Novu(process.env.NOVU_SECRET_API_KEY as string);
  try {
    const c = await db.consultant.create({ data: newConsultant });
    if (c) {
      const findAdmin = await db.staff.findFirst({
        where: { role: "ADMIN" },
      });
      if (findAdmin !== null) {
        const subscriberId = await db.user.findFirst({
          where: { email: findAdmin.email },
        });
        await novu.trigger("suzu-sales", {
          to: {
            subscriberId: subscriberId?.id as string,
          },
          payload: {
            text: `${session?.user.name} created new consultan successfully!`,
            url: `${c?.id}`,
          },
        });
      }
    }
    return { consultant: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateConsultant = async (
  id: ConsultantId,
  consultant: UpdateConsultantParams
) => {
  const { session } = await getUserAuth();
  const { id: consultantId } = consultantIdSchema.parse({ id });
  const newConsultant = updateConsultantSchema.parse({
    ...consultant,
    userId: session?.user.id!,
  });
  try {
    const c = await db.consultant.update({
      where: { id: consultantId, userId: session?.user.id! },
      data: newConsultant,
    });
    return { consultant: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteConsultant = async (id: ConsultantId) => {
  const { session } = await getUserAuth();
  const { id: consultantId } = consultantIdSchema.parse({ id });
  try {
    const c = await db.consultant.delete({
      where: { id: consultantId, userId: session?.user.id! },
    });
    return { consultant: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
