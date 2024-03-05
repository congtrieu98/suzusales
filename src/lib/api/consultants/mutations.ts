import { db } from "@/lib/db/index";
import { 
  ConsultantId, 
  NewConsultantParams,
  UpdateConsultantParams, 
  updateConsultantSchema,
  insertConsultantSchema, 
  consultantIdSchema 
} from "@/lib/db/schema/consultants";
import { getUserAuth } from "@/lib/auth/utils";

export const createConsultant = async (consultant: NewConsultantParams) => {
  const { session } = await getUserAuth();
  const newConsultant = insertConsultantSchema.parse({ ...consultant, userId: session?.user.id! });
  try {
    const c = await db.consultant.create({ data: newConsultant });
    return { consultant: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateConsultant = async (id: ConsultantId, consultant: UpdateConsultantParams) => {
  const { session } = await getUserAuth();
  const { id: consultantId } = consultantIdSchema.parse({ id });
  const newConsultant = updateConsultantSchema.parse({ ...consultant, userId: session?.user.id! });
  try {
    const c = await db.consultant.update({ where: { id: consultantId, userId: session?.user.id! }, data: newConsultant})
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
    const c = await db.consultant.delete({ where: { id: consultantId, userId: session?.user.id! }})
    return { consultant: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

