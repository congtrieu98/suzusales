"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/contracts/useOptimisticContracts";
import { type Contract } from "@/lib/db/schema/contracts";
import { cn, formatDateSlash } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ContractForm from "@/components/contracts/ContractForm";
import { type Consultant, type ConsultantId } from "@/lib/db/schema/consultants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Loader, Timer, User } from "lucide-react";
import moment from "moment";

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

  // console.log("optimisticContract:", JSON.parse(optimisticContract))

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
        <h1 className="font-semibold text-2xl">{'Hợp đồng'}</h1>
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
        {/* {JSON.stringify(optimisticContract, null, 2)} */}
        <div className="">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle
                  className={
                    optimisticContract.customerContract ? "opacity-75" : ""
                  }
                >
                  {'Customer contract Link'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex mr-2">
                    <User />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Creator: <br />
                      <span className="font-semibold">
                        {/* {dataJson.consultant} */}
                      </span>
                    </p>
                  </div>
                  <span className="flex mr-2">
                    <CalendarCheck />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Create At: <br />
                      <span className="font-semibold">
                        {moment(optimisticContract.createdAt).format(
                          formatDateSlash
                        )}
                      </span>
                    </p>
                  </div>
                  <span className="flex mr-2">
                    <Loader />
                  </span>
                  <div className="space-y-2 mb-4">
                    <div className="text-base font-medium">
                      <div className="mb-2">
                        Status:
                        <br />
                        <span className="font-semibold">
                          {optimisticContract.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* <span className="flex mr-2">
                    <Timer />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium ">Create Air</p>
                    <span className="font-semibold">
                      {moment(optimisticContract.airDate).format(
                        formatDateSlash
                      )}
                    </span>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </pre>
    </div>
  );
}
