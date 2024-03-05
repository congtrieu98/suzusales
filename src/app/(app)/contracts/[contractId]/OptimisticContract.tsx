"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/contracts/useOptimisticContracts";
import { type Contract } from "@/lib/db/schema/contracts";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ContractForm from "@/components/contracts/ContractForm";
import { type Consultant, type ConsultantId } from "@/lib/db/schema/consultants";

export default function OptimisticContract({ 
  contract,
  consultants,
  consultantId 
}: { 
  contract: Contract; 
  
  consultants: Consultant[];
  consultantId?: ConsultantId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Contract) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticContract, setOptimisticContract] = useOptimistic(contract);
  const updateContract: TAddOptimistic = (input) =>
    setOptimisticContract({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ContractForm
          contract={optimisticContract}
          consultants={consultants}
        consultantId={consultantId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateContract}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticContract.customerContract}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticContract.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticContract, null, 2)}
      </pre>
    </div>
  );
}
