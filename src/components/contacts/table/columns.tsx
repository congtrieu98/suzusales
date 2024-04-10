"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CompleteCompany } from "@/lib/db/schema/companies";
import { CompleteConsultant } from "@/lib/db/schema/consultants";
import { formatDateSlash } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
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
  // ConsultantStaff: {
  //   id: string;
  //   consultantId: string;
  //   staffId: string;
  //   email: string;
  // }[];
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
    header: "Company name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "creator",
    header: "Creator",
    cell: ({ row }) => {
      return row.original.user.name;
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
      const company = row.original;
      return (
        <Company
          // @ts-ignore
          company={company}
        />
      );
    },
  },
];

const Company = ({
  // @ts-ignore
  company,
}: // openModal,
{
  consultant: CompleteCompany;
  // openModal: TOpenModal;
}) => {
  // const optimistic = consultant.id === "optimistic";
  // const deleting = consultant.id === "delete";
  // const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("companies")
    ? pathname
    : pathname + "/companies/";

  return (
    <Button variant={"link"} asChild>
      <Link href={basePath + "/" + company.id}>Details</Link>
    </Button>
  );
};
