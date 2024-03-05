import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/consultants/useOptimisticConsultants";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { type Consultant, insertConsultantParams } from "@/lib/db/schema/consultants";
import {
  createConsultantAction,
  deleteConsultantAction,
  updateConsultantAction,
} from "@/lib/actions/consultants";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";


const ConsultantForm = ({

  consultant,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  consultant?: Consultant | null;

  openModal?: (consultant?: Consultant) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Consultant>(insertConsultantParams);
  const editing = !!consultant?.id;
  const [airDate, setAirDate] = useState<Date | undefined>(
    consultant?.airDate,
  );
  const { data: session } = useSession()

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("consultants");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Consultant },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Consultant ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const consultantParsed = await insertConsultantParams.safeParseAsync({ ...payload });
    if (!consultantParsed.success) {
      setErrors(consultantParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = consultantParsed.data;
    values.creator = session?.user.name as string
    console.log(values)
    const pendingConsultant: Consultant = {
      updatedAt: consultant?.updatedAt ?? new Date(),
      createdAt: consultant?.createdAt ?? new Date(),
      id: consultant?.id ?? "",
      userId: consultant?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingConsultant,
          action: editing ? "update" : "create",
        });

        // const error = editing
        //   ? await updateConsultantAction({ ...values, id: consultant.id })
        //   : await createConsultantAction(values);

        // const errorFormatted = {
        //   error: error ?? "Error",
        //   values: pendingConsultant
        // };
        // onSuccess(
        //   editing ? "update" : "create",
        //   error ? errorFormatted : undefined,
        // );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={""}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.customerName ? "text-destructive" : "",
          )}
        >
          Customer Name
        </Label>
        <Input
          type="text"
          name="customerName"
          className={cn(errors?.customerName ? "ring ring-destructive" : "")}
          defaultValue={consultant?.customerName ?? ""}
        />
        {errors?.customerName ? (
          <p className="text-xs text-destructive mt-2">{errors.customerName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.projectName ? "text-destructive" : "",
          )}
        >
          Project Name
        </Label>
        <Input
          type="text"
          name="projectName"
          className={cn(errors?.projectName ? "ring ring-destructive" : "")}
          defaultValue={consultant?.projectName ?? ""}
        />
        {errors?.projectName ? (
          <p className="text-xs text-destructive mt-2">{errors.projectName[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.content ? "text-destructive" : "",
          )}
        >
          Content
        </Label>
        <Input
          type="text"
          name="content"
          className={cn(errors?.content ? "ring ring-destructive" : "")}
          defaultValue={consultant?.content ?? ""}
        />
        {errors?.content ? (
          <p className="text-xs text-destructive mt-2">{errors.content[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.airDate ? "text-destructive" : "",
          )}
        >
          Air Date
        </Label>
        <br />
        <Popover>
          <Input
            name="airDate"
            onChange={() => { }}
            readOnly
            value={airDate?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
          />

          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !consultant?.airDate && "text-muted-foreground",
              )}
            >
              {airDate ? (
                <span>{format(airDate, "PPP")}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setAirDate(e)}
              selected={airDate}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.airDate ? (
          <p className="text-xs text-destructive mt-2">{errors.airDate[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.status ? "text-destructive" : "",
          )}
        >
          Status
        </Label>
        {/* <Input
          type="text"
          name="status"
          className={cn(errors?.status ? "ring ring-destructive" : "")}
          defaultValue={consultant?.status ?? ""}
        /> */}
        <Select
          name="status"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Reviewing">Reviewing</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="Cancel">Cancel</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.status ? (
          <p className="text-xs text-destructive mt-2">{errors.status[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.creator ? "text-destructive" : "",
          )}
        >
          Creator
        </Label>
        <Input
          type="text"
          name="creator"
          className={cn(errors?.creator ? "ring ring-destructive" : "")}
          defaultValue={consultant?.creator ?? ""}
        />
        {errors?.creator ? (
          <p className="text-xs text-destructive mt-2">{errors.creator[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> */}
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: consultant });
              const error = await deleteConsultantAction(consultant.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: consultant,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default ConsultantForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
