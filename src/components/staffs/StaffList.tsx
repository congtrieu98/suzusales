"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Staff, CompleteStaff } from "@/lib/db/schema/staffs";
import Modal from "@/components/shared/Modal";

import { useOptimisticStaffs } from "@/app/(app)/staffs/useOptimisticStaffs";
import { Button } from "@/components/ui/button";
import StaffForm from "./StaffForm";
import { PlusIcon } from "lucide-react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

type TOpenModal = (staff?: Staff) => void;

export default function StaffList({ staffs }: { staffs: CompleteStaff[] }) {
  const { optimisticStaffs, addOptimisticStaff } = useOptimisticStaffs(staffs);
  const [open, setOpen] = useState(false);
  const [activeStaff, setActiveStaff] = useState<Staff | null>(null);
  const openModal = (staff?: Staff) => {
    setOpen(true);
    staff ? setActiveStaff(staff) : setActiveStaff(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeStaff ? "Edit Staff" : "Create Staff"}
      >
        <StaffForm
          staff={activeStaff}
          addOptimistic={addOptimisticStaff}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticStaffs.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <div className="container mx-auto py-10">
          <DataTable
            columns={columns}
            //@ts-ignore
            data={optimisticStaffs}
          />
        </div>
      )}
    </div>
  );
}

const Staff = ({
  staff,
  openModal,
}: {
  staff: CompleteStaff;
  openModal: TOpenModal;
}) => {
  const optimistic = staff.id === "optimistic";
  const deleting = staff.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("staffs")
    ? pathname
    : pathname + "/staffs/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{staff.email}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + staff.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No staffs
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new staff.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Staffs{" "}
        </Button>
      </div>
    </div>
  );
};
