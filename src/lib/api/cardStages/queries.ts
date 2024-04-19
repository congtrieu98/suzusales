import { db } from "@/lib/db/index";
import { type CardStageId, cardStageIdSchema } from "@/lib/db/schema/cardStages";

export const getCardStages = async () => {
  const c = await db.cardStage.findMany({});
  return { cardStages: c };
};

export const getCardStageById = async (id: CardStageId) => {
  const { id: cardStageId } = cardStageIdSchema.parse({ id });
  const c = await db.cardStage.findFirst({
    where: { id: cardStageId}});
  return { cardStage: c };
};


