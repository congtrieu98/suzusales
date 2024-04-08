import { authOptions, checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NextAuthProvider from "@/lib/auth/Provider";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { Session, getServerSession } from "next-auth";
import { Novu } from "@novu/node";
import NotificationMenu from "@/components/NotificationMenu";
import PageSetting from "./settings/page";

const inter = Inter({ subsets: ["latin"] });

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  const session = (await getServerSession(authOptions)) as Session;

  const novu = new Novu(process.env.NOVU_SECRET_API_KEY as string);

  await novu.subscribers.identify(session?.user?.id, {
    firstName: session?.user?.name as string,
    email: session?.user?.email as string,
  });
  console.log("server side");
  return (
    <main className={inter.className}>
      <NextAuthProvider>
        <TrpcProvider cookies={cookies().toString()}>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 md:p-8 pt-2 p-8 overflow-y-auto">
              <div className="justify-end mb-4 hidden md:flex">
                <PageSetting />
                <NotificationMenu />
              </div>
              <Navbar />
              {children}
            </main>
          </div>
        </TrpcProvider>
      </NextAuthProvider>

      <Toaster richColors />
    </main>
  );
}
