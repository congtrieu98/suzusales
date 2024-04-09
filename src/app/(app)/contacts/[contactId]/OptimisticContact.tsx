"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/contacts/useOptimisticContacts";
import { type Contact } from "@/lib/db/schema/contacts";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ContactForm from "@/components/contacts/ContactForm";


export default function OptimisticContact({ 
  contact,
   
}: { 
  contact: Contact; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Contact) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticContact, setOptimisticContact] = useOptimistic(contact);
  const updateContact: TAddOptimistic = (input) =>
    setOptimisticContact({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ContactForm
          contact={optimisticContact}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateContact}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticContact.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticContact.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticContact, null, 2)}
      </pre>
    </div>
  );
}
