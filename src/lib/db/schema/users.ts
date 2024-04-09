import { getUsers } from "@/lib/api/users/queries";
import { userSchema } from "prisma/zod/user";
import { z } from "zod";

export type User = z.infer<typeof userSchema>;
// this type infers the return from getCompanies() - meaning it will include any joins
export type CompleteUser = Awaited<ReturnType<typeof getUsers>>["users"][number];
