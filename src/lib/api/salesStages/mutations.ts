import { db } from "@/lib/db/index";
import { 
  SalesStageId, 
  NewSalesStageParams,
  UpdateSalesStageParams, 
  updateSalesStageSchema,
  insertSalesStageSchema, 
  salesStageIdSchema 
} from "@/lib/db/schema/salesStages";
import { getUserAuth } from "@/lib/auth/utils";

export const createSalesStage = async (salesStage: NewSalesStageParams) => {
  const { session } = await getUserAuth();
  const newSalesStage = insertSalesStageSchema.parse({ ...salesStage, userId: session?.user.id! });
  try {
    const s = await db.salesStage.create({ data: newSalesStage });
    return { salesStage: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateSalesStage = async (id: SalesStageId, salesStage: UpdateSalesStageParams) => {
  const { session } = await getUserAuth();
  const { id: salesStageId } = salesStageIdSchema.parse({ id });
  const newSalesStage = updateSalesStageSchema.parse({ ...salesStage, userId: session?.user.id! });
  try {
    const s = await db.salesStage.update({ where: { id: salesStageId, userId: session?.user.id! }, data: newSalesStage})
    return { salesStage: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteSalesStage = async (id: SalesStageId) => {
  const { session } = await getUserAuth();
  const { id: salesStageId } = salesStageIdSchema.parse({ id });
  try {
    const s = await db.salesStage.delete({ where: { id: salesStageId, userId: session?.user.id! }})
    return { salesStage: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

