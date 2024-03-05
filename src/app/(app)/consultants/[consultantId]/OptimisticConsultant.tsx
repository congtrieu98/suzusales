"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/consultants/useOptimisticConsultants";
import { type Consultant } from "@/lib/db/schema/consultants";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ConsultantForm from "@/components/consultants/ConsultantForm";


export default function OptimisticConsultant({ 
  consultant,
   
}: { 
  consultant: Consultant; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Consultant) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticConsultant, setOptimisticConsultant] = useOptimistic(consultant);
  const updateConsultant: TAddOptimistic = (input) =>
    setOptimisticConsultant({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ConsultantForm
          consultant={optimisticConsultant}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateConsultant}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticConsultant.customerName}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticConsultant.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticConsultant, null, 2)}
      </pre>
    </div>
  );
}
