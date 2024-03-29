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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Contract, insertContractParams, CompleteContract } from "@/lib/db/schema/contracts";
import {
  createContractAction,
  deleteContractAction,
  updateContractAction,
} from "@/lib/actions/contracts";
import {
  type Consultant,
  type ConsultantId,
} from "@/lib/db/schema/consultants";
import { Checkbox } from "../ui/checkbox";

const ContractForm = ({
  consultants,
  consultantId,
  contract,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  contract?: CompleteContract | null;
  consultants: Consultant[];
  consultantId?: ConsultantId;
  openModal?: (contract?: CompleteContract) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Contract>(insertContractParams);
  const editing = !!contract?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();
  const [step, setStep] = useState<string[]>([]);
  // const [inputValues, setInputValues] = useState({
  //   customerContract: '',
  //   paymentSchedule: '',
  //   scanContract: '',
  //   finalContract: '',
  //   customerAddress: ''
  // });

  const router = useRouter();
  const backpath = useBackPath("contracts");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: CompleteContract }
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

  // const handleInputChange = (event: { target: { name: string; value: string; }; }) => {
  //   const { name, value } = event.target;

  //   setInputValues({
  //     ...inputValues,
  //     [name]: value
  //   });

  //   if (value === '') {
  //     setStep(prevStep => prevStep.filter(item => item !== name));
  //     setInputValues({
  //       ...inputValues,
  //       [name]: ''
  //     });
  //   }
  //   else {
  //     if (!step.includes(name)) {
  //       setStep(prevStep => [...prevStep, name]);
  //     }
  //   }
  // };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const contractParsed = await insertContractParams.safeParseAsync({
      consultantId,
      ...payload,
    });
    if (!contractParsed.success) {
      setErrors(contractParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = contractParsed.data;
    const pendingContract: CompleteContract = {
      updatedAt: contract?.updatedAt ?? new Date(),
      createdAt: contract?.createdAt ?? new Date(),
      id: contract?.id ?? "",
      userId: contract?.userId ?? "",
      checkSteps: contract?.checkSteps ?? step,
      consultant: consultants.find(item => item?.id === consultantId)!,
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingContract,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateContractAction({
            ...values,
            checkSteps: contract.checkSteps.concat(step),
            id: contract.id,
          })
          : await createContractAction({ ...values, checkSteps: step });

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingContract,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
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
        <Checkbox
          checked={
            contract?.checkSteps.includes("customerContract")
              ? contract?.checkSteps.includes("customerContract")
              : step?.includes("customerContract")
          }
          onCheckedChange={(checked) => {
            return !checked
              ? setStep((prevStep) =>
                prevStep.filter((item) => item !== "customerContract")
              )
              : setStep((prevStep) => [...prevStep, "customerContract"]);
          }}
        />
        <Label
          className={cn(
            "ml-2 mb-2 inline-block",
            errors?.customerContract ? "text-destructive" : ""
          )}
        >
          Customer Contract
        </Label>
        <Input
          type="text"
          name="customerContract"
          // onChange={(e) => handleInputChange(e)}
          className={cn(
            errors?.customerContract ? "ring ring-destructive" : ""
          )}
          defaultValue={contract?.customerContract ?? ""}
        />
        {errors?.customerContract ? (
          <p className="text-xs text-destructive mt-2">
            {errors.customerContract[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Checkbox
          checked={
            contract?.checkSteps.includes("paymentSchedule")
              ? contract?.checkSteps.includes("paymentSchedule")
              : step?.includes("paymentSchedule")
          }
          onCheckedChange={(checked) => {
            return !checked
              ? setStep((prevStep) =>
                prevStep.filter((item) => item !== "paymentSchedule")
              )
              : setStep((prevStep) => [...prevStep, "paymentSchedule"]);
          }}
        />
        <Label
          className={cn(
            "ml-2 mb-2 inline-block",
            errors?.paymentSchedule ? "text-destructive" : ""
          )}
        >
          Payment Schedule
        </Label>
        <Input
          type="text"
          name="paymentSchedule"
          // onChange={(e) => handleInputChange(e)}
          className={cn(errors?.paymentSchedule ? "ring ring-destructive" : "")}
          defaultValue={contract?.paymentSchedule ?? ""}
        />
        {errors?.paymentSchedule ? (
          <p className="text-xs text-destructive mt-2">
            {errors.paymentSchedule[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Checkbox
          checked={
            contract?.checkSteps.includes("scanContract")
              ? contract?.checkSteps.includes("scanContract")
              : step?.includes("scanContract")
          }
          onCheckedChange={(checked) => {
            return !checked
              ? setStep((prevStep) =>
                prevStep.filter((item) => item !== "scanContract")
              )
              : setStep((prevStep) => [...prevStep, "scanContract"]);
          }}
        />
        <Label
          className={cn(
            "ml-2 mb-2 inline-block",
            errors?.scanContract ? "text-destructive" : ""
          )}
        >
          Scan Contract
        </Label>
        <Input
          type="text"
          name="scanContract"
          // onChange={(e) => handleInputChange(e)}
          className={cn(errors?.scanContract ? "ring ring-destructive" : "")}
          defaultValue={contract?.scanContract ?? ""}
        />
        {errors?.scanContract ? (
          <p className="text-xs text-destructive mt-2">
            {errors.scanContract[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Checkbox
          checked={
            contract?.checkSteps.includes("finalContract")
              ? contract?.checkSteps.includes("finalContract")
              : step?.includes("finalContract")
          }
          onCheckedChange={(checked) => {
            return !checked
              ? setStep((prevStep) =>
                prevStep.filter((item) => item !== "finalContract")
              )
              : setStep((prevStep) => [...prevStep, "finalContract"]);
          }}
        />
        <Label
          className={cn(
            "ml-2 mb-2 inline-block",
            errors?.finalContract ? "text-destructive" : ""
          )}
        >
          Final Contract
        </Label>
        <Input
          type="text"
          name="finalContract"
          // onChange={(e) => handleInputChange(e)}
          className={cn(errors?.finalContract ? "ring ring-destructive" : "")}
          defaultValue={contract?.finalContract ?? ""}
        />
        {errors?.finalContract ? (
          <p className="text-xs text-destructive mt-2">
            {errors.finalContract[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Checkbox
          checked={
            contract?.checkSteps.includes("customerAddress")
              ? contract?.checkSteps.includes("customerAddress")
              : step?.includes("customerAddress")
          }
          onCheckedChange={(checked) => {
            return !checked
              ? setStep((prevStep) =>
                prevStep.filter((item) => item !== "customerAddress")
              )
              : setStep((prevStep) => [...prevStep, "customerAddress"]);
          }}
        />
        <Label
          className={cn(
            "ml-2 mb-2 inline-block",
            errors?.customerAddress ? "text-destructive" : ""
          )}
        >
          Customer Address
        </Label>
        <Input
          type="text"
          name="customerAddress"
          // onChange={(e) => handleInputChange(e)}
          className={cn(errors?.customerAddress ? "ring ring-destructive" : "")}
          defaultValue={contract?.customerAddress ?? ""}
        />
        {errors?.customerAddress ? (
          <p className="text-xs text-destructive mt-2">
            {errors.customerAddress[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.note ? "text-destructive" : ""
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
            errors?.status ? "text-destructive" : ""
          )}
        >
          Status
        </Label>
        <Select name="status" defaultValue={contract?.status ?? "Inprogress"}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Inprogress">Inprogress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.status ? (
          <p className="text-xs text-destructive mt-2">{errors.status[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div className="mb-4">
        <div className="flex space-x-2">
          <Checkbox
            name="checkSteps"
            checked={
              editing
                ? contract?.checkSteps.concat(step)?.length === 5
                : step.length === 5
            }
            onCheckedChange={(checked) => {
              if (checked) {
                const fullSteps = [
                  "paymentSchedule",
                  "customerContract",
                  "scanContract",
                  "finalContract",
                  "customerAddress",
                ];
                if (
                  editing
                    ? contract?.checkSteps?.length === 0
                    : step?.length === 0
                ) {
                  setStep(fullSteps);
                } else {
                  const missingSteps = fullSteps.filter((stepItem) =>
                    editing
                      ? !contract?.checkSteps.includes(stepItem)
                      : !step.includes(stepItem)
                  );
                  setStep((prevStep) => [...prevStep, ...missingSteps]);
                }
              } else {
                setStep([]);
              }
            }}
          />
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.checkSteps ? "text-destructive" : ""
            )}
          >
            Check all
          </Label>
        </div>

        {errors?.checkSteps ? (
          <p className="text-xs text-destructive mt-2">
            {errors.checkSteps[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {consultantId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.consultantId ? "text-destructive" : ""
            )}
          >
            Consultant
          </Label>
          <Select defaultValue={contract?.consultantId} name="consultantId">
            <SelectTrigger
              className={cn(
                errors?.consultantId ? "ring ring-destructive" : ""
              )}
            >
              <SelectValue placeholder="Select a consultant" />
            </SelectTrigger>
            <SelectContent>
              {consultants?.map((consultant) => (
                <SelectItem
                  key={consultant.id}
                  value={consultant.id.toString()}
                >
                  {consultant.id}
                  {/* TODO: Replace with a field from the consultant model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.consultantId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.consultantId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
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
              addOptimistic &&
                addOptimistic({ action: "delete", data: contract });
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
