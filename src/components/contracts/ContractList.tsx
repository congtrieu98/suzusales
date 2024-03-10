"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Contract, CompleteContract } from "@/lib/db/schema/contracts";
import Modal from "@/components/shared/Modal";
import { type Consultant, type ConsultantId } from "@/lib/db/schema/consultants";
import { useOptimisticContracts } from "@/app/(app)/contracts/useOptimisticContracts";
import { Button } from "@/components/ui/button";
import ContractForm from "./ContractForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (contract?: Contract) => void;

export default function ContractList({
  contracts,
  consultants,
  consultantId,
  consultantStatus
}: {
  contracts: CompleteContract[];
  consultants: Consultant[];
  consultantId?: ConsultantId;
  consultantStatus: string
}) {
  const { optimisticContracts, addOptimisticContract } = useOptimisticContracts(
    contracts,
    consultants
  );
  const [open, setOpen] = useState(false);
  const [activeContract, setActiveContract] = useState<Contract | null>(null);
  const openModal = (contract?: Contract) => {
    setOpen(true);
    contract ? setActiveContract(contract) : setActiveContract(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeContract ? "Edit Contract" : "Create Contract"}
      >
        <ContractForm
          contract={activeContract}
          addOptimistic={addOptimisticContract}
          openModal={openModal}
          closeModal={closeModal}
          consultants={consultants}
          consultantId={consultantId}
        />
      </Modal>
      {
        consultantStatus === 'Done' &&
        <div className="absolute right-0 top-0 ">
          <Button onClick={() => openModal()} variant={"outline"}>
            +
          </Button>
        </div>
      }
      {optimisticContracts.length === 0 ? (
        <EmptyState openModal={openModal} consultantStatus={consultantStatus} />
      ) : (
        <ul>
          {optimisticContracts.map((contract) => (
            <Contract
              contract={contract}
              key={contract.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Contract = ({
  contract,
  openModal,
}: {
  contract: CompleteContract;
  openModal: TOpenModal;
}) => {
  const optimistic = contract.id === "optimistic";
  const deleting = contract.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("contracts")
    ? pathname
    : pathname + "/contracts/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>
          {/* <Link href={contract.customerContract} legacyBehavior >
            <a target="_blank" rel="noopener noreferrer">
              Contract details
            </a>
          </Link> */}
          <Button variant={"link"} asChild>
            <Link href={basePath + "/" + contract.id}>
              Contract details
            </Link>
          </Button>
        </div>
      </div>
      {/* <Button variant={"link"} asChild>
        <Link href={basePath + "/" + contract.id}>
          Edit
        </Link>
      </Button> */}
    </li>
  );
};

const EmptyState = ({ openModal, consultantStatus }: { openModal: TOpenModal, consultantStatus: string }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No contracts
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new contract.
      </p>
      {
        consultantStatus === 'Done' &&
        <div className="mt-6">
          <Button onClick={() => openModal()}>
            <PlusIcon className="h-4" /> New Contracts </Button>
        </div>
      }
    </div>
  );
};
