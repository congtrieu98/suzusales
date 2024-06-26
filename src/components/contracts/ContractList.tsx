"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Contract, CompleteContract } from "@/lib/db/schema/contracts";
import Modal from "@/components/shared/Modal";
import {
  type Consultant,
  type ConsultantId,
} from "@/lib/db/schema/consultants";
import { useOptimisticContracts } from "@/app/(app)/contracts/useOptimisticContracts";
import { Button } from "@/components/ui/button";
import ContractForm from "./ContractForm";
import { PlusIcon, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type TOpenModal = (contract?: CompleteContract) => void;

export default function ContractList({
  contracts,
  consultants,
  consultantId,
  consultantStatus,
}: {
  contracts: CompleteContract[];
  consultants: Consultant[];
  consultantId?: ConsultantId;
  consultantStatus: string;
}) {
  const { optimisticContracts, addOptimisticContract } = useOptimisticContracts(
    contracts,
    consultants
  );
  const [open, setOpen] = useState(false);
  const [activeContract, setActiveContract] = useState<CompleteContract | null>(
    null
  );
  const openModal = (contract?: CompleteContract) => {
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
      {consultantStatus === "Done" && (
        <div className="absolute right-0 top-0 ">
          <Button onClick={() => openModal()} variant={"outline"}>
            +
          </Button>
        </div>
      )}
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
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div className="flex justify-between ">
          <Button variant={"link"} asChild>
            <Link href={basePath + "/" + contract.id}>Contract details</Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="mt-2 mr-2 cursor-pointer">
                <Trash2 size={20} />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this contract?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    console.log("delete contracts");
                  }}
                >
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </li>
  );
};

const EmptyState = ({
  openModal,
  consultantStatus,
}: {
  openModal: TOpenModal;
  consultantStatus: string;
}) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No contracts
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        You can only create a contract when consultant is status is done
      </p>
      {consultantStatus === "Done" && (
        <div className="mt-6">
          <Button onClick={() => openModal()}>
            <PlusIcon className="h-4" /> New Contracts{" "}
          </Button>
        </div>
      )}
    </div>
  );
};
