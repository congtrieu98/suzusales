"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/contacts/useOptimisticContacts";
import { CompleteContact, type Contact } from "@/lib/db/schema/contacts";
import { cn, formatDateSlash } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ContactForm from "@/components/contacts/ContactForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlignLeft, Building, Edit, Mail, NotebookText, Phone, User } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from "moment";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";


export default function OptimisticContact({
  contact,

}: {
  contact: CompleteContact;


}) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false);
  const openModal = (_?: Contact) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticContact, setOptimisticContact] = useOptimistic(contact);
  const updateContact: TAddOptimistic = (input) =>
    setOptimisticContact({ ...input.data });

  return (
    <div className="">
      <Modal open={open} setOpen={setOpen}>
        <ContactForm
          contact={optimisticContact}

          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateContact}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl"></h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>


      <div className="p-5 bg-gray-100">
        <div className="flex space-x-3">
          <div className="avatar">
            <Avatar className="w-20 h-20">
              <AvatarImage
              // src={infoSalesOwner?.image!}
              // alt={infoSalesOwner?.name!}
              />
              <AvatarFallback className="bg-orange-400 text-white text-2xl">KT</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-xl text-center items-center mt-5 font-medium">
            {contact.name}
          </div>
        </div>


        {/* content */}
        <div className="space-y-4 bg-white rounded-b-md px-2 pt-2 rounded-lg mt-10">
          <div className="border-b-2 p-2">
            <div className="flex space-x-2">
              <div className="icon">
                <Mail size={20} className="" />
              </div>
              <div className="ml-8">
                <div className="text-sm font-light ">{contact.email}</div>
              </div>
            </div>

          </div>

          <div className="border-b-2 p-2">
            <div className="flex space-x-2">
              <div className="icon">
                <Building size={20} className="" />
              </div>
              <div className="ml-8">
                <div className="text-sm font-light ">{contact.company.name}</div>
              </div>

            </div>

          </div>

          <div className="p-2">
            <div className="flex space-x-2">
              <div className="icon">
                <Phone size={20} className="" />
              </div>
              <div className="ml-8">
                <div className="text-sm font-light ">0123456789</div>
              </div>
            </div>

          </div>
        </div>

        {/* Lifcircle status */}
        <div className="mb-10">
          <div className="font-medium mt-10">
            Lifecycle stage
          </div>

          <div className="mt-4">
            <div className="md:flex grid grid-colds-1 text-center items-center">
              <div className="text-sm py-4 px-8 bg-blue-400 text-white md:rounded-l-full rounded-t-lg border-r-[1px] border-r-white">
                new
              </div>
              <div className="text-sm py-4 px-6 bg-blue-400 text-white">
                contacted
              </div>
              <Select defaultValue="interested">
                <SelectTrigger className="md:w-[150px] w-full text-sm py-[26px] px-6 bg-blue-400 text-white rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="unqualified" className="text-red-500">Unqualified</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="text-sm py-4 px-6 bg-white text-black">
                Qualified
              </div>
              <Select defaultValue="negotiation">
                <SelectTrigger className="md:w-[150px] w-full text-sm py-7 px-6 bg-white text-black rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="lost" className="text-red-500">Lost</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select defaultValue="won">
                <SelectTrigger className="md:w-[150px] w-full text-sm py-7 px-6 bg-white text-black md:rounded-r-full rounded-b-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="churned" className="text-red-500 hover:bg-red-500 hover:text-white">Churned</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>



        {/* Note */}
        <div className="">
          <div className="flex py-4 px-6 space-x-2 bg-gray-50 rounded-t-xl border-b-2">
            <AlignLeft size={20} />
            <div className="font-medium">Notes</div>
          </div>

          <div className="flex space-x-2 w-full bg-white p-6">
            <div className="avatar">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={session?.user?.image!}
                  alt={session?.user?.name!}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex w-full space-x-2">
              <Input type="text" />
              <button type="submit" className="bg-gray-100 p-2 rounded-md">Add</button>
            </div>
          </div>

          <div className="bg-gray-50 py-4 px-6 rounded-b-xl shadow-lg">
            {/* info user note */}
            <div className="flex space-y-2">
              <div className="avatar mr-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={session?.user?.image!}
                    alt={session?.user?.name!}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex justify-between w-full">
                <div className="font-normal">username</div>
                <div className="text-gray-300 text-xs">{moment(Date()).format(formatDateSlash)}</div>
              </div>
            </div>

            {/* content */}
            <div className="text-sm ml-9 p-4 bg-white mt-2 rounded-lg shadow-lg  mb-3">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Qui voluptatum ratione deleniti error dolorem nesciunt recusandae sunt consectetur quam eligendi.
            </div>


            <div className="flex space-y-2">
              <div className="avatar mr-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={session?.user?.image!}
                    alt={session?.user?.name!}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex justify-between w-full">
                <div className="font-normal">username</div>
                <div className="text-gray-300 text-xs">{moment(Date()).format(formatDateSlash)}</div>
              </div>
            </div>

            {/* content */}
            <div className="text-sm ml-9 p-4 bg-white mt-2 rounded-lg shadow-lg  mb-3">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Qui voluptatum ratione deleniti error dolorem nesciunt recusandae sunt consectetur quam eligendi.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
