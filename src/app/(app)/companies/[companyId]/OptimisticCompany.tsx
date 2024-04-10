"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/companies/useOptimisticCompanies";
import { type Company } from "@/lib/db/schema/companies";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CompanyForm from "@/components/companies/CompanyForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BellRing, Check, SwitchCamera, User2, Users } from "lucide-react";
import { CompleteContact } from "@/lib/db/schema/contacts";
import { DataTableContact } from "@/components/contacts/table/data-table";
import { columnsContact } from "@/components/contacts/table/columns";

export default function OptimisticCompany({
  company,
  contacts,
}: {
  company: Company;
  contacts: CompleteContact[];
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Company) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCompany, setOptimisticCompany] = useOptimistic(company);
  const updateCompany: TAddOptimistic = (input) =>
    setOptimisticCompany({ ...input.data });

  return (
    // <div className="m-4">
    //   <Modal open={open} setOpen={setOpen}>
    //     <CompanyForm
    //       company={optimisticCompany}

    //       closeModal={closeModal}
    //       openModal={openModal}
    //       addOptimistic={updateCompany}
    //     />
    //   </Modal>
    //   <div className="flex justify-between items-end mb-4">
    //     <h1 className="font-semibold text-2xl">{optimisticCompany.name}</h1>
    //     <Button className="" onClick={() => setOpen(true)}>
    //       Edit
    //     </Button>
    //   </div>
    //   <pre
    //     className={cn(
    //       "bg-secondary p-4 rounded-lg break-all text-wrap",
    //       optimisticCompany.id === "optimistic" ? "animate-pulse" : "",
    //     )}
    //   >
    //     {JSON.stringify(optimisticCompany, null, 2)}
    //   </pre>
    // </div>
    <div className="p-5 bg-gray-100 ">
      {/* Header content */}
      <div className="flex space-x-4">
        <div className="logo w-24 h-24 rounded-lg bg-orange-400 shadow-lg">
          CT
        </div>
        <div className="space-y-2">
          <div className="text-xxl font-bold">Ten cong ty</div>
          <div className="flex">
            <div className="text-gray-500 mr-3 mt-1">Sales Owner:</div>
            <div className="text-gray-500 mr-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-gray-500 mt-1">{company.salesOwner}</div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="mt-5">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 bg-white py-4 px-6 rounded-xl shadow-lg">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-3">
                <Users />
                <div className="font-bold">Contacts</div>
              </div>
              <div>Total contact: 1</div>
            </div>
            <DataTableContact
              columns={columnsContact}
              //@ts-ignore
              data={contacts?.length > 0 ? contacts : []}
            />
            {/* <Card>
              <CardHeader>
                
              </CardHeader>
              <CardContent className="grid gap-4">
                
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Check className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
              </CardFooter>
            </Card> */}
          </div>
          <div>Infor company</div>
        </div>
      </div>
    </div>
  );
}
