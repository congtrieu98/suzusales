"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CompleteCompany } from "@/lib/db/schema/companies";
import { CompleteConsultant } from "@/lib/db/schema/consultants";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type CompanyTypeColumns = {
  id: string;
  name: string;
  salesOwner: string;
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

export const columns: ColumnDef<CompanyTypeColumns>[] = [
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
    accessorKey: "salesOwner",
    header: "SalesOwner",
  },
  {
    accessorKey: "creator",
    header: "Creator",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
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
