"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/deals/useOptimisticDeals";
import { type Deal } from "@/lib/db/schema/deals";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import DealForm from "@/components/deals/DealForm";


export default function OptimisticDeal({ 
  deal,
   
}: { 
  deal: Deal; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Deal) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticDeal, setOptimisticDeal] = useOptimistic(deal);
  const updateDeal: TAddOptimistic = (input) =>
    setOptimisticDeal({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <DealForm
          deal={optimisticDeal}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateDeal}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticDeal.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticDeal.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticDeal, null, 2)}
      </pre>
    </div>
  );
}
