"use client";

import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CompleteConsultant } from "@/lib/db/schema/consultants";
import { CompleteStaff, Staff } from "@/lib/db/schema/staffs";
import { formatDateSlash } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";
import StaffForm from "../StaffForm";
import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/staffs/useOptimisticStaffs";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type StaffsTypeColumns = {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<StaffsTypeColumns>[] = [
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },

  {
    accessorKey: "Action",
    cell: ({ row }) => {
      const staff = row.original;
      return <Staff staff={staff} />;
    },
  },
];

const Staff = ({ staff }: { staff: CompleteStaff }) => {
  const pathname = usePathname();
  const basePath = pathname.includes("consultants")
    ? pathname
    : pathname + "/consultants/";

  const [open, setOpen] = useState(false);
  const openModal = (_?: Staff) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticStaff, setOptimisticStaff] = useOptimistic(staff);
  const updateStaff: TAddOptimistic = (input) =>
    setOptimisticStaff({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <StaffForm
          staff={optimisticStaff}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateStaff}
        />
      </Modal>
      <Button variant={"link"} onClick={() => setOpen(true)}>
        Edit
      </Button>
    </div>
  );
};
