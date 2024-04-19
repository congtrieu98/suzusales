import { db } from "@/lib/db/index";
import { 
  CardStageId, 
  NewCardStageParams,
  UpdateCardStageParams, 
  updateCardStageSchema,
  insertCardStageSchema, 
  cardStageIdSchema 
} from "@/lib/db/schema/cardStages";

export const createCardStage = async (cardStage: NewCardStageParams) => {
  const newCardStage = insertCardStageSchema.parse(cardStage);
  try {
    const c = await db.cardStage.create({ data: newCardStage });
    return { cardStage: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCardStage = async (id: CardStageId, cardStage: UpdateCardStageParams) => {
  const { id: cardStageId } = cardStageIdSchema.parse({ id });
  const newCardStage = updateCardStageSchema.parse(cardStage);
  try {
    const c = await db.cardStage.update({ where: { id: cardStageId }, data: newCardStage})
    return { cardStage: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCardStage = async (id: CardStageId) => {
  const { id: cardStageId } = cardStageIdSchema.parse({ id });
  try {
    const c = await db.cardStage.delete({ where: { id: cardStageId }})
    return { cardStage: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

