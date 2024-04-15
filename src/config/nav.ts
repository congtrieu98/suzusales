import { SidebarLink } from "@/components/SidebarItems";
import {
  Building2,
  Globe,
  Handshake,
  HomeIcon,
  Settings,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  // { href: "/account", title: "Account", icon: UserRound },
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
      {
        href: "/companies",
        title: "Companies",
        icon: Building2,
      },
      {
        href: "/contacts",
        title: "Contacts",
        icon: Users,
      },
      {
        href: "/deals",
        title: "Deals",
        icon: Handshake,
      },
    ],
  },
];
