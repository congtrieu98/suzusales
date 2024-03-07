"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/consultants/useOptimisticConsultants";
import { type Consultant } from "@/lib/db/schema/consultants";
import { cn, formatDateSlash } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ConsultantForm from "@/components/consultants/ConsultantForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlarmClockOff, AudioLines, CalendarCheck, Loader, Pencil, Timer, User, Users } from "lucide-react";
import moment from "moment";


export default function OptimisticConsultant({
  consultant,

}: {
  consultant: Consultant;


}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Consultant) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticConsultant, setOptimisticConsultant] = useOptimistic(consultant);
  const updateConsultant: TAddOptimistic = (input) =>
    setOptimisticConsultant({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ConsultantForm
          consultant={optimisticConsultant}

          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateConsultant}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticConsultant.customerName}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticConsultant.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {/* {JSON.stringify(optimisticConsultant, null, 2)} */}
        <div className="pb-3 border-b mb-8">
          <Card className="mb-4">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className={optimisticConsultant.projectName ? "opacity-75" : ""}>
                  {optimisticConsultant.projectName}
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
                      <span className="font-semibold">{optimisticConsultant.creator}</span>
                    </p>
                  </div>
                  <span className="flex mr-2">
                    <CalendarCheck />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium">
                      Create At: <br />
                      <span className="font-semibold">{moment(optimisticConsultant.createdAt).format(formatDateSlash)}</span>
                    </p>
                  </div>
                  <span className="flex mr-2">
                    <Loader />
                  </span>
                  <div className="space-y-2 mb-4">
                    <div className="text-base font-medium">
                      <div className="mb-2">
                        Status:<br />
                        <span className="font-semibold">{optimisticConsultant.status}</span>
                      </div>
                    </div>
                  </div>

                  <span className="flex mr-2">
                    <Timer />
                  </span>
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium ">Create Air</p>
                    <span className="font-semibold">
                      {moment(optimisticConsultant.airDate).format(formatDateSlash)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </pre>
    </div>
  );
}
