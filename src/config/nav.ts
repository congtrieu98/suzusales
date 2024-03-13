import { SidebarLink } from "@/components/SidebarItems";
import { Globe, HomeIcon, Settings, UserPlus, UserRound } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: UserRound },
  { href: "/staffs", title: "Manager User", icon: UserPlus },
  // { href: "/settings", title: "Settings", icon: Settings },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      // {
      //   href: "/pages",
      //   title: "Pages",
      //   icon: Globe,
      // },
      {
        href: "/consultants",
        title: "Consultants",
        icon: Globe,
      },
    ],
  },
];
