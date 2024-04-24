import { db } from "@/lib/db/index";
import {
  CardStageId,
  NewCardStageParams,
  UpdateCardStageParams,
  updateCardStageSchema,
  insertCardStageSchema,
  cardStageIdSchema,
} from "@/lib/db/schema/cardStages";
import { CompleteSalesStage } from "@/lib/db/schema/salesStages";

export const createCardStage = async (cardStage: NewCardStageParams) => {
  // const newCardStage = insertCardStageSchema.parse(cardStage);
  const lastCardStage = await db.cardStage.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = lastCardStage ? lastCardStage.order + 1 : 1;
  const newCardStage = insertCardStageSchema.parse({
    ...cardStage,
    order: newOrder,
  });
  try {
    const c = await db.cardStage.create({ data: newCardStage });
    return { cardStage: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCardStage = async (
  id: CardStageId,
  cardStage: UpdateCardStageParams
) => {
  const { id: cardStageId } = cardStageIdSchema.parse({ id });
  const newCardStage = updateCardStageSchema.parse(cardStage);
  try {
    const c = await db.cardStage.update({
      where: { id: cardStageId },
      data: newCardStage,
    });
    return { cardStage: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCardStageOrder = async (
  dataCardStageOrder: CompleteSalesStage[]
) => {
  let cardStage;

  try {
    dataCardStageOrder.map(async (item) => {
      const transaction = item.cardStage.map((card) =>
        db.cardStage.update({
          where: {
            id: card.id,
          },
          data: {
            order: card.order,
            salesStageId: card.salesStageId,
          },
        })
      );
      cardStage = await db.$transaction(transaction);
    });
  } catch (error) {
    return {
      error: "Failed to reoreder",
    };
  }

  return { data: cardStage };
};

export const deleteCardStage = async (id: CardStageId) => {
  const { id: cardStageId } = cardStageIdSchema.parse({ id });
  try {
    const c = await db.cardStage.delete({ where: { id: cardStageId } });
    return { cardStage: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
