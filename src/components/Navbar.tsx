"use client";

import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { AlignRight, Cog, CogIcon, Settings } from "lucide-react";
import { additionalLinks } from "@/config/nav";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";
import PageSetting from "@/app/(app)/settings/page";
import NotificationMenu from "./NotificationMenu";
import SidebarItems from "./SidebarItems";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const additionalLinksCustom = additionalLinks.filter(
    (addLinCustom) => addLinCustom.links
  );

  return (
    <div className="md:hidden border-b mb-4 pb-2 w-full">
      <nav className="flex justify-between w-full items-center">
        <div className="">
          <Link href={"/dashboard"}>
            <Image
              width={60}
              height={60}
              src={"/assets/favicon.png"}
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex">
          <PageSetting />
          <NotificationMenu />

          <Button variant="ghost" onClick={() => setOpen(!open)}>
            <AlignRight />
          </Button>
        </div>
      </nav>
      {open ? (
        <div className="my-4 p-4 bg-muted">
          <div className="flex justify-between items-start">
            <ul className="space-y-2 pb-4">
              <SidebarItems />
            </ul>
          </div>

          <UserDetails session={session as Session} setOpen={setOpen} />
        </div>
      ) : null}
    </div>
  );
}

const UserDetails = ({
  session,
  setOpen,
}: {
  session: Session;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  if (session.user === null) return null;
  const { user } = session;

  if (!user?.name || user.name.length == 0) return null;

  return (
    <Link href="/account">
      <div
        onClick={() => setOpen(false)}
        className="flex items-center justify-between w-full border-t border-border pt-4"
      >
        <div className="text-muted-foreground">
          <p className="text-xs text-blue-400 underline">{user.name ?? "John Doe"}</p>
          <p className="text-xs font-light pr-4">
            {user.email ?? "john@doe.com"}
          </p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image as string} />
          <AvatarFallback className="border-border border-2 text-muted-foreground">
            {user.name
              ? user.name
                ?.split(" ")
                .map((word: any) => word[0].toUpperCase())
                .join("")
              : "~"}
          </AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
};
