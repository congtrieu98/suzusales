import { db } from "@/lib/db/index";
import {
  SalesStageId,
  NewSalesStageParams,
  UpdateSalesStageParams,
  updateSalesStageSchema,
  insertSalesStageSchema,
  salesStageIdSchema,
} from "@/lib/db/schema/salesStages";
import { getUserAuth } from "@/lib/auth/utils";

export const createSalesStage = async (salesStage: NewSalesStageParams) => {
  const { session } = await getUserAuth();
  const lastList = await db.salesStage.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const newOrder = lastList ? lastList.order + 1 : 1;
  const newSalesStage = insertSalesStageSchema.parse({
    ...salesStage,
    userId: session?.user.id!,
    order: newOrder,
  });
  try {
    const s = await db.salesStage.create({ data: newSalesStage });
    return { salesStage: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateSalesStage = async (
  id: SalesStageId,
  salesStage: UpdateSalesStageParams
) => {
  const { session } = await getUserAuth();
  const { id: salesStageId } = salesStageIdSchema.parse({ id });
  const newSalesStage = updateSalesStageSchema.parse({
    ...salesStage,
    userId: session?.user.id!,
  });
  try {
    const s = await db.salesStage.update({
      where: { id: salesStageId, userId: session?.user.id! },
      data: newSalesStage,
    });
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
    const s = await db.salesStage.delete({
      where: { id: salesStageId, userId: session?.user.id! },
    });
    return { salesStage: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const copySalesStage = async (id: SalesStageId) => {
  const { session } = await getUserAuth();
  const { id: salesStageId } = salesStageIdSchema.parse({ id });
  try {
    const saleStageTocopy = await db.salesStage.findUnique({
      where: { id: salesStageId },
      include: {
        cardStage: true,
      },
    });

    if (!saleStageTocopy) {
      return { error: "List not found" };
    }

    const lastList = await db.salesStage.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    const list = await db.salesStage.create({
      //@ts-ignore
      data: {
        name: `${saleStageTocopy.name} - Copy`,
        userId: session?.user?.id,
        order: newOrder,
        cardStage: {
          createMany: {
            data: saleStageTocopy.cardStage.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cardStage: true,
      },
    });

    return { salesStageCopy: list };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
