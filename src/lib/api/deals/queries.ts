import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type DealId, dealIdSchema } from "@/lib/db/schema/deals";

export const getDeals = async () => {
  const { session } = await getUserAuth();
  const d = await db.deal.findMany({ where: {userId: session?.user.id!}});
  return { deals: d };
};

export const getDealById = async (id: DealId) => {
  const { session } = await getUserAuth();
  const { id: dealId } = dealIdSchema.parse({ id });
  const d = await db.deal.findFirst({
    where: { id: dealId, userId: session?.user.id!}});
  return { deal: d };
};


