"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CompleteCompany } from "@/lib/db/schema/companies";
import { CompleteConsultant } from "@/lib/db/schema/consultants";
import { CompleteContact } from "@/lib/db/schema/contacts";
import { formatDateSlash } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Mail, Phone } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type ContactTypeColumns = {
  id: string;
  name: string;
  email: string;
  creator: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  company: {
    id: string;
    name: string;
    salesOwner: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
  };
};


export const columnsContact: ColumnDef<ContactTypeColumns>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "creator",
    header: "Creator",
    cell: ({ row }) => {
      console.log("row:", row)
      return row.original.user.name;
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      return row.original.company.name;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return moment(row.getValue("createdAt")).format(formatDateSlash);
    },
  },
  {
    accessorKey: "Action",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <Contact
          // @ts-ignore
          contact={contact}
        />
      );
    },
  },
];

const Contact = ({
  // @ts-ignore
  contact,
}: // openModal,
  {
    consultant: CompleteCompany;
    contact: CompleteContact
  }) => {
  // const optimistic = consultant.id === "optimistic";
  // const deleting = consultant.id === "delete";
  // const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("contacts")
    ? pathname
    : pathname.includes("companies") ? '/contacts'
      : pathname + "/contacts/";

  return (
    // <Button variant={"link"} asChild>
    //   <Link href={basePath + "/" + company.id}>Details</Link>
    // </Button>
    <div className="flex space-x-2">
      <Mail color="#808080" className="border p-1 rounded-md bg-slate-100 hover:border-blue-400 cursor-pointer" />
      <Phone color="#808080" className="border p-1 rounded-md bg-slate-100 hover:border-blue-400 cursor-pointer" />
      <Link href={basePath + "/" + contact.id}>
        <ExternalLink color="#808080" className="border p-1 rounded-md bg-slate-100 hover:border-blue-400 cursor-pointer" />
      </Link>


    </div>
  );
};
