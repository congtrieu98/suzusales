import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/deals/useOptimisticDeals";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  type Deal,
  insertDealParams,
  CompleteDeal,
} from "@/lib/db/schema/deals";
import {
  createDealAction,
  deleteDealAction,
  updateDealAction,
} from "@/lib/actions/deals";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CompleteCompany } from "@/lib/db/schema/companies";
import { BadgeDollarSign, CircleDollarSign } from "lucide-react";
import { CompleteUser } from "@/lib/db/schema/users";
import { Avatar, AvatarImage } from "../ui/avatar";

const DealForm = ({
  deal,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
  companies,
  users,
}: {
  deal?: Deal | null;
  companies: CompleteCompany[];
  openModal?: (deal?: Deal) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
  users: CompleteUser[];
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Deal>(insertDealParams);
  const editing = !!deal?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("deals");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Deal }
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
      toast.success(`Deal ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const dealParsed = await insertDealParams.safeParseAsync({ ...payload });
    if (!dealParsed.success) {
      setErrors(dealParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = dealParsed.data;
    const pendingDeal: Deal = {
      updatedAt: deal?.updatedAt ?? new Date(),
      createdAt: deal?.createdAt ?? new Date(),
      id: deal?.id ?? "",
      userId: deal?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingDeal,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateDealAction({ ...values, id: deal.id })
          : await createDealAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingDeal,
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
    <form action={handleSubmit} onChange={handleChange}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : ""
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "border-red-400" : "")}
          defaultValue={deal?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.companyId ? "text-destructive" : ""
          )}
        >
          Company
        </Label>
        <Select name="companyId" defaultValue={deal?.companyId ?? ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item?.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.companyId ? (
          <p className="text-xs text-destructive mt-2">{errors.companyId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.status ? "text-destructive" : ""
            )}
          >
            Status
          </Label>
          <Select name="status" defaultValue={deal?.status ?? "NEW"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="NEW">NEW</SelectItem>
                <SelectItem value="FOLLOW-UP">FOLLOW-UP</SelectItem>
                <SelectItem value="UNDER-REVIEW">UNDER REVIEW</SelectItem>
                <SelectItem value="DEMO">DEMO</SelectItem>
                <SelectItem value="WON">WON</SelectItem>
                <SelectItem value="LOST">LOST</SelectItem>
                <SelectItem value="UNASSIGNED">UNASSIGNED</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
              errors?.dealValue ? "text-destructive" : ""
            )}
          >
            Deal Value
          </Label>
          <div className="flex">
            <div className="bg-gray-100 rounded-l-md rounded-r-none">
              <CircleDollarSign className="p-1.5 mt-1" size={30} />
            </div>
            <Input
              type="number"
              min={0}
              name="dealValue"
              className={cn(
                errors?.dealValue ? "border-red-400" : "rounded-l-none"
              )}
              defaultValue={deal?.dealValue ?? undefined}
            />
          </div>

          {errors?.dealValue ? (
            <p className="text-xs text-destructive mt-2">
              {errors.dealValue[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      </div>

      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.dealOwner ? "text-destructive" : ""
          )}
        >
          Deals Owner
        </Label>
        <Select name="dealOwner" defaultValue={editing ? deal?.dealOwner : ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {users?.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.name as string}
                  className=""
                >
                  <div className="flex">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={item.image as string}></AvatarImage>
                    </Avatar>
                    <div className="mt-2">{item.name}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors?.dealOwner ? (
          <p className="text-xs text-destructive mt-2">{errors.dealOwner[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic && addOptimistic({ action: "delete", data: deal });
              const error = await deleteDealAction(deal.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: deal,
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

export default DealForm;

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
