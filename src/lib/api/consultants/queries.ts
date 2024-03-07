import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type ConsultantId, consultantIdSchema } from "@/lib/db/schema/consultants";

export const getConsultants = async () => {
  const { session } = await getUserAuth();
  const c = await db.consultant.findMany({
    where: { userId: session?.user.id! },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return { consultants: c };
};

export const getConsultantById = async (id: ConsultantId) => {
  const { session } = await getUserAuth();
  const { id: consultantId } = consultantIdSchema.parse({ id });
  const c = await db.consultant.findFirst({
    where: { id: consultantId, userId: session?.user.id! }
  });
  return { consultant: c };
};

export const getConsultantByIdWithContracts = async (id: ConsultantId) => {
  const { session } = await getUserAuth();
  const { id: consultantId } = consultantIdSchema.parse({ id });
  const c = await db.consultant.findFirst({
    where: { id: consultantId, userId: session?.user.id! },
    include: { Contract: { include: { consultant: true } } }
  });
  if (c === null) return { consultant: null };
  const { Contract, ...consultant } = c;

  return { consultant, contracts: Contract };
};

