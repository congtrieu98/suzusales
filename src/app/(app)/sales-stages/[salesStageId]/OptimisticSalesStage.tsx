"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/sales-stages/useOptimisticSalesStages";
import { type SalesStage } from "@/lib/db/schema/salesStages";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import SalesStageForm from "@/components/salesStages/SalesStageForm";


export default function OptimisticSalesStage({ 
  salesStage,
   
}: { 
  salesStage: SalesStage; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: SalesStage) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticSalesStage, setOptimisticSalesStage] = useOptimistic(salesStage);
  const updateSalesStage: TAddOptimistic = (input) =>
    setOptimisticSalesStage({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <SalesStageForm
          salesStage={optimisticSalesStage}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateSalesStage}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticSalesStage.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticSalesStage.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticSalesStage, null, 2)}
      </pre>
    </div>
  );
}
