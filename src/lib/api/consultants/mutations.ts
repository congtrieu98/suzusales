import { db } from "@/lib/db/index";
import {
  ConsultantId,
  NewConsultantParams,
  UpdateConsultantParams,
  consultantIdSchema,
} from "@/lib/db/schema/consultants";
import { getUserAuth } from "@/lib/auth/utils";
import { Novu } from "@novu/node";

export const createConsultant = async (consultant: NewConsultantParams) => {
  const { session } = await getUserAuth();
  const staff = await db.staff.findMany();
  const newConsultant = {
    ...consultant,
    userId: session?.user.id!,
    ConsultantStaff: {
      create: consultant.assignedId.map((item) => ({
        staffId: item ? item : "",
        email: item ? staff.find((staffId) => staffId?.id === item)?.email : "",
      })),
    },
  };

  const novu = new Novu(process.env.NOVU_SECRET_API_KEY as string);
  try {
    const c = await db.consultant.create({
      //@ts-ignore
      data: newConsultant,
      include: {
        ConsultantStaff: true,
      },
    });
    if (c) {
      // const findAdmin = await db.staff.findFirst({
      //   where: { role: "ADMIN" },
      // });
      const checkUserAdmin = session?.user.role === "ADMIN";
      if (checkUserAdmin) {
        if (c?.assignedId?.length > 0) {
          c?.assignedId.map(async (sb) => {
            const findStaff = await db.staff.findFirst({
              where: { id: sb },
            });
            const subscriberId = await db.user.findFirst({
              where: { email: findStaff?.email },
            });
            await novu.trigger("suzu-sales", {
              to: {
                subscriberId: subscriberId?.id as string,
              },
              payload: {
                text: `${session?.user.name} created new consultant for you!`,
                url: `${c?.id}`,
              },
            });
          });
        }
      } else {
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
  const staff = await db.staff.findMany();
  const newConsultant = {
    ...consultant,
    userId: session?.user.id!,
    ConsultantStaff: {
      create: consultant.assignedId.map((item) => ({
        staffId: item ? item : "",
        email: item ? staff.find((staffId) => staffId?.id === item)?.email : "",
      })),
    },
  };
  try {
    const c = await db.consultant.update({
      where: { id: consultantId, userId: session?.user.id! },
      //@ts-ignore
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
