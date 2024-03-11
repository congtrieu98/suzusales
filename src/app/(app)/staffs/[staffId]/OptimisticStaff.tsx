"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/staffs/useOptimisticStaffs";
import { type Staff } from "@/lib/db/schema/staffs";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import StaffForm from "@/components/staffs/StaffForm";


export default function OptimisticStaff({ 
  staff,
   
}: { 
  staff: Staff; 
  
  
}) {
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
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticStaff.email}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticStaff.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticStaff, null, 2)}
      </pre>
    </div>
  );
}
