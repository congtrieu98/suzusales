import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type ConsultantId,
  consultantIdSchema,
  ConsultantIds,
} from "@/lib/db/schema/consultants";

export const getConsultants = async () => {
  const c = await db.consultant.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      ConsultantStaff: true,
      user: true,
    },
  });
  return { consultants: c };
};

export const getConsultantByIds = async (ids: ConsultantIds) => {
  const ConsultantIds = ids;
  try {
    const consultants = await db.consultant.findMany({
      where: {
        id: {
          in: ConsultantIds,
        },
      },
      include: {
        ConsultantStaff: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return consultants;
  } catch (error) {
    console.error("Error retrieving consultants:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
};

export const getConsultantById = async (id: ConsultantId) => {
  const { id: consultantId } = consultantIdSchema.parse({ id });
  const c = await db.consultant.findFirst({
    where: { id: consultantId },
  });
  return c;
};

export const getConsultantByIdWithContracts = async (id: ConsultantId) => {
  const { id: consultantId } = consultantIdSchema.parse({ id });

  const c = await db.consultant.findFirst({
    where: { id: consultantId },
    include: {
      Contract: { include: { consultant: true } },
      ConsultantStaff: true,
    },
  });
  if (c === null) return { consultant: null };
  const { Contract, ...consultant } = c;

  return { consultant, contracts: Contract };
};
