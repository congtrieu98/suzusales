"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CompleteConsultant } from "@/lib/db/schema/consultants";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type ConsultantTypeColumns = {
  id: string;
  customerName: string;
  projectName: string;
  content: string;
  airDate: Date;
  status: string;
  creator: string;
  userId: string;
  assignedId: string[];
  createdAt: Date;
  updatedAt: Date;
  ConsultantStaff: {
    id: string;
    consultantId: string;
    staffId: string;
    email: string;
  }[];
  user: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
  };
};

export const columns: ColumnDef<ConsultantTypeColumns>[] = [
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
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "creator",
    header: "Creator",
  },
  {
    accessorKey: "assignedId",
    header: "Asigned",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "Action",
    cell: ({ row }) => {
      const consultant = row.original;
      return <Consultant consultant={consultant} />;
    },
  },
];

const Consultant = ({
  consultant,
}: // openModal,
{
  consultant: CompleteConsultant;
  // openModal: TOpenModal;
}) => {
  // const optimistic = consultant.id === "optimistic";
  // const deleting = consultant.id === "delete";
  // const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("consultants")
    ? pathname
    : pathname + "/consultants/";

  return (
    <Button variant={"link"} asChild>
      <Link href={basePath + "/" + consultant.id}>Details</Link>
    </Button>
  );
};
