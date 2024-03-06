"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  type Consultant,
  CompleteConsultant,
} from "@/lib/db/schema/consultants";
import Modal from "@/components/shared/Modal";

import { useOptimisticConsultants } from "@/app/(app)/consultants/useOptimisticConsultants";
import { Button } from "@/components/ui/button";
import ConsultantForm from "./ConsultantForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (consultant?: Consultant) => void;

export default function ConsultantList({
  consultants,
}: {
  consultants: CompleteConsultant[];
}) {
  const { optimisticConsultants, addOptimisticConsultant } =
    useOptimisticConsultants(consultants);
  const [open, setOpen] = useState(false);
  const [activeConsultant, setActiveConsultant] = useState<Consultant | null>(
    null
  );
  const openModal = (consultant?: Consultant) => {
    setOpen(true);
    consultant ? setActiveConsultant(consultant) : setActiveConsultant(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeConsultant ? "Edit Consultant" : "Create Consultant"}
      >
        <ConsultantForm
          consultant={activeConsultant}
          addOptimistic={addOptimisticConsultant}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticConsultants.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticConsultants.map((consultant) => (
            <Consultant
              consultant={consultant}
              key={consultant.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Consultant = ({
  consultant,
  openModal,
}: {
  consultant: CompleteConsultant;
  openModal: TOpenModal;
}) => {
  const optimistic = consultant.id === "optimistic";
  const deleting = consultant.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("consultants")
    ? pathname
    : pathname + "/consultants/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{consultant.customerName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + consultant.id}>Details</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No consultants
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new consultant.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Consultants{" "}
        </Button>
      </div>
    </div>
  );
};
