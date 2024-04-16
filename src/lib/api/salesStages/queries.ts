import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type SalesStageId, salesStageIdSchema } from "@/lib/db/schema/salesStages";

export const getSalesStages = async () => {
  const { session } = await getUserAuth();
  const s = await db.salesStage.findMany({ where: {userId: session?.user.id!}});
  return { salesStages: s };
};

export const getSalesStageById = async (id: SalesStageId) => {
  const { session } = await getUserAuth();
  const { id: salesStageId } = salesStageIdSchema.parse({ id });
  const s = await db.salesStage.findFirst({
    where: { id: salesStageId, userId: session?.user.id!}});
  return { salesStage: s };
};


