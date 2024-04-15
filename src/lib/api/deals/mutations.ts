import { db } from "@/lib/db/index";
import { 
  DealId, 
  NewDealParams,
  UpdateDealParams, 
  updateDealSchema,
  insertDealSchema, 
  dealIdSchema 
} from "@/lib/db/schema/deals";
import { getUserAuth } from "@/lib/auth/utils";

export const createDeal = async (deal: NewDealParams) => {
  const { session } = await getUserAuth();
  const newDeal = insertDealSchema.parse({ ...deal, userId: session?.user.id! });
  try {
    const d = await db.deal.create({ data: newDeal });
    return { deal: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateDeal = async (id: DealId, deal: UpdateDealParams) => {
  const { session } = await getUserAuth();
  const { id: dealId } = dealIdSchema.parse({ id });
  const newDeal = updateDealSchema.parse({ ...deal, userId: session?.user.id! });
  try {
    const d = await db.deal.update({ where: { id: dealId, userId: session?.user.id! }, data: newDeal})
    return { deal: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteDeal = async (id: DealId) => {
  const { session } = await getUserAuth();
  const { id: dealId } = dealIdSchema.parse({ id });
  try {
    const d = await db.deal.delete({ where: { id: dealId, userId: session?.user.id! }})
    return { deal: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

