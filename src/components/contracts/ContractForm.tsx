import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/contracts/useOptimisticContracts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Contract, insertContractParams } from "@/lib/db/schema/contracts";
import {
  createContractAction,
  deleteContractAction,
  updateContractAction,
} from "@/lib/actions/contracts";
import { type Consultant, type ConsultantId } from "@/lib/db/schema/consultants";

const ContractForm = ({
  consultants,
  consultantId,
  contract,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  contract?: Contract | null;
  consultants: Consultant[];
  consultantId?: ConsultantId
  openModal?: (contract?: Contract) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Contract>(insertContractParams);
  const editing = !!contract?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("contracts");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Contract },
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
      toast.success(`Contract ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const contractParsed = await insertContractParams.safeParseAsync({ consultantId, ...payload });
    if (!contractParsed.success) {
      setErrors(contractParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = contractParsed.data;
    const pendingContract: Contract = {
      updatedAt: contract?.updatedAt ?? new Date(),
      createdAt: contract?.createdAt ?? new Date(),
      id: contract?.id ?? "",
      userId: contract?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingContract,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateContractAction({ ...values, id: contract.id })
          : await createContractAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingContract 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.customerContract ? "text-destructive" : "",
          )}
        >
          Customer Contract
        </Label>
        <Input
          type="text"
          name="customerContract"
          className={cn(errors?.customerContract ? "ring ring-destructive" : "")}
          defaultValue={contract?.customerContract ?? ""}
        />
        {errors?.customerContract ? (
          <p className="text-xs text-destructive mt-2">{errors.customerContract[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.paymentSchedule ? "text-destructive" : "",
          )}
        >
          Payment Schedule
        </Label>
        <Input
          type="text"
          name="paymentSchedule"
          className={cn(errors?.paymentSchedule ? "ring ring-destructive" : "")}
          defaultValue={contract?.paymentSchedule ?? ""}
        />
        {errors?.paymentSchedule ? (
          <p className="text-xs text-destructive mt-2">{errors.paymentSchedule[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.scanContract ? "text-destructive" : "",
          )}
        >
          Scan Contract
        </Label>
        <Input
          type="text"
          name="scanContract"
          className={cn(errors?.scanContract ? "ring ring-destructive" : "")}
          defaultValue={contract?.scanContract ?? ""}
        />
        {errors?.scanContract ? (
          <p className="text-xs text-destructive mt-2">{errors.scanContract[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.finalContract ? "text-destructive" : "",
          )}
        >
          Final Contract
        </Label>
        <Input
          type="text"
          name="finalContract"
          className={cn(errors?.finalContract ? "ring ring-destructive" : "")}
          defaultValue={contract?.finalContract ?? ""}
        />
        {errors?.finalContract ? (
          <p className="text-xs text-destructive mt-2">{errors.finalContract[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.customerAddress ? "text-destructive" : "",
          )}
        >
          Customer Address
        </Label>
        <Input
          type="text"
          name="customerAddress"
          className={cn(errors?.customerAddress ? "ring ring-destructive" : "")}
          defaultValue={contract?.customerAddress ?? ""}
        />
        {errors?.customerAddress ? (
          <p className="text-xs text-destructive mt-2">{errors.customerAddress[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.note ? "text-destructive" : "",
          )}
        >
          Note
        </Label>
        <Input
          type="text"
          name="note"
          className={cn(errors?.note ? "ring ring-destructive" : "")}
          defaultValue={contract?.note ?? ""}
        />
        {errors?.note ? (
          <p className="text-xs text-destructive mt-2">{errors.note[0]}</p>
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
        <Input
          type="text"
          name="status"
          className={cn(errors?.status ? "ring ring-destructive" : "")}
          defaultValue={contract?.status ?? ""}
        />
        {errors?.status ? (
          <p className="text-xs text-destructive mt-2">{errors.status[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.checkSteps ? "text-destructive" : "",
          )}
        >
          Check Steps
        </Label>
        <Input
          type="text"
          name="checkSteps"
          className={cn(errors?.checkSteps ? "ring ring-destructive" : "")}
          defaultValue={contract?.checkSteps ?? ""}
        />
        {errors?.checkSteps ? (
          <p className="text-xs text-destructive mt-2">{errors.checkSteps[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {consultantId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.consultantId ? "text-destructive" : "",
          )}
        >
          Consultant
        </Label>
        <Select defaultValue={contract?.consultantId} name="consultantId">
          <SelectTrigger
            className={cn(errors?.consultantId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a consultant" />
          </SelectTrigger>
          <SelectContent>
          {consultants?.map((consultant) => (
            <SelectItem key={consultant.id} value={consultant.id.toString()}>
              {consultant.id}{/* TODO: Replace with a field from the consultant model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.consultantId ? (
          <p className="text-xs text-destructive mt-2">{errors.consultantId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
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
              addOptimistic && addOptimistic({ action: "delete", data: contract });
              const error = await deleteContractAction(contract.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: contract,
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

export default ContractForm;

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
