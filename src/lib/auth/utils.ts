import { db } from "@/lib/db/index";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import { env } from "@/lib/env.mjs";
import GoogleProvider from "next-auth/providers/google";
import { getStaffs } from "../api/staffs/queries";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }
}

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
    };
  } | null;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      const dataUser = await getStaffs();
      if (user.email === "trieunguyen2806@gmail.com") {
        session.user.role = "ADMIN";
      } else {
        dataUser.staffs.map((item) => {
          if (item.role !== "" && user.email === item.email) {
            session.user.role = item.role;
          } else {
            return null;
          }
        });
      }
      return session;
    },
    async signIn({ user }) {
      const listStaff = await getStaffs();
      const emailPermission = listStaff.staffs.map((user) => user.email);
      if (
        user.email &&
        (emailPermission.includes(user.email) ||
          user.email === "trieunguyen2806@gmail.com")
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();
  if (!session) redirect("/");
};
