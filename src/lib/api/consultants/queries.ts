import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type ConsultantId,
  consultantIdSchema,
} from "@/lib/db/schema/consultants";

export const getConsultants = async () => {
  const { session } = await getUserAuth();
  // if (session?.user.role === "ADMIN") {
  const c = await db.consultant.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      ConsultantStaff: true,
    }
  });
  return { consultants: c };
  // } else {
  //   const findUserByEmail = await db.staff.findFirst({
  //     where: {
  //       email: session?.user.email,
  //     },
  //   });
  //   const c = await db.consultantStaff.findMany({
  //     where: {
  //       staffId: findUserByEmail?.id!,
  //     },
  //     include: {
  //       consultant: true,
  //       staff: true,
  //     },
  //   });
  //   return { consultants: c };
  // }
};

export const getConsultantById = async (id: ConsultantId) => {
  const { session } = await getUserAuth();
  const ConsultantIds = id
  console.log("ConsultantIds:", ConsultantIds)
  console.log("ConsultantIds:", ConsultantIds)
  console.log("ConsultantIds:", ConsultantIds)
  console.log("ConsultantIds:", ConsultantIds)
  console.log("ConsultantIds:", ConsultantIds)
  console.log("ConsultantIds:", ConsultantIds)
  console.log("ConsultantIds:", ConsultantIds)
  // const { id: consultantId } = consultantIdSchema.parse({ id });
  // if (session?.user.role === "ADMIN") {
  const consultants = ConsultantIds.map(async (item) => {
    const c = await db.consultant.findFirst({
      where: { id: item },
    });
    return c;
  })

  return { data: consultants };
  // } else {
  //   const c = await db.consultant.findFirst({
  //     where: { id: consultantId, userId: session?.user.id! },
  //   });
  //   return { consultant: c };
  // }
};

export const getConsultantByIdWithContracts = async (id: ConsultantId) => {
  const { session } = await getUserAuth();
  const { id: consultantId } = consultantIdSchema.parse({ id });
  if (session?.user.role === "ADMIN") {
    const c = await db.consultant.findFirst({
      where: { id: consultantId },
      include: { Contract: { include: { consultant: true } } },
    });
    if (c === null) return { consultant: null };
    const { Contract, ...consultant } = c;

    return { consultant, contracts: Contract };
  } else {
    const c = await db.consultant.findFirst({
      where: { id: consultantId, userId: session?.user.id! },
      include: { Contract: { include: { consultant: true } } },
    });
    if (c === null) return { consultant: null };
    const { Contract, ...consultant } = c;

    return { consultant, contracts: Contract };
  }
};
