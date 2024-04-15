"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Contact, CompleteContact } from "@/lib/db/schema/contacts";
import Modal from "@/components/shared/Modal";

import { useOptimisticContacts } from "@/app/(app)/contacts/useOptimisticContacts";
import { Button } from "@/components/ui/button";
import ContactForm from "./ContactForm";
import { PlusIcon } from "lucide-react";
import { DataTableContact } from "./table/data-table";
import { columnsContact } from "./table/columns";
import { CompleteCompany } from "@/lib/db/schema/companies";

type TOpenModal = (contact?: Contact) => void;

export default function ContactList({
  contacts,
  companies,
}: {
  contacts: CompleteContact[];
  companies: CompleteCompany[];
}) {
  const { optimisticContacts, addOptimisticContact } =
    useOptimisticContacts(contacts);
  const [open, setOpen] = useState(false);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const openModal = (contact?: Contact) => {
    setOpen(true);
    contact ? setActiveContact(contact) : setActiveContact(null);
  };
  const closeModal = () => setOpen(false);

  // console.log("companies:", companies);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeContact ? "Edit Contact" : "Create Contact"}
      >
        <ContactForm
          contact={activeContact}
          addOptimistic={addOptimisticContact}
          openModal={openModal}
          closeModal={closeModal}
          companies={companies}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticContacts.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <div className="container mx-auto py-10">
          <DataTableContact
            columns={columnsContact}
            //@ts-ignore
            data={optimisticContacts?.length > 0 ? optimisticContacts : []}
          />
        </div>
      )}
    </div>
  );
}

const Contact = ({
  contact,
  openModal,
}: {
  contact: CompleteContact;
  openModal: TOpenModal;
}) => {
  const optimistic = contact.id === "optimistic";
  const deleting = contact.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("contacts")
    ? pathname
    : pathname + "/contacts/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{contact.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + contact.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No contacts
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new contact.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Contacts{" "}
        </Button>
      </div>
    </div>
  );
};
