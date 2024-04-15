import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/companies/useOptimisticCompanies";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  type Company,
  insertCompanyParams,
  CompleteCompany,
} from "@/lib/db/schema/companies";
import {
  createCompanyAction,
  deleteCompanyAction,
  updateCompanyAction,
} from "@/lib/actions/companies";
import { CompleteUser } from "@/lib/db/schema/users";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarImage } from "../ui/avatar";
import { CircleFadingPlus, Mail, Trash2, User } from "lucide-react";
import moment from "moment";

interface IContact {
  name?: string;
  email?: string;
}
const CompanyForm = ({
  company,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
  users,
}: {
  company?: CompleteCompany | null;

  openModal?: (company?: CompleteCompany) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
  users: CompleteUser[] | null;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Company>(insertCompanyParams);
  const editing = !!company?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();
  const [dataContact, setDataContact] = useState<IContact[]>([]);
  const [showInputs, setShowInputs] = useState(false);

  const router = useRouter();
  const backpath = useBackPath("companies");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: CompleteCompany }
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
      toast.success(`Company ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const companyParsed = await insertCompanyParams.safeParseAsync({
      ...payload,
    });
    if (!companyParsed.success) {
      setErrors(companyParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = companyParsed.data;
    const pendingCompany: CompleteCompany = {
      updatedAt: company?.updatedAt ?? new Date(),
      createdAt: company?.createdAt ?? new Date(),
      id: company?.id ?? "",
      userId: company?.userId ?? "",
      contacts: company?.contacts!,
      user: company?.user!,
      notes: company?.notes!,
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingCompany,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateCompanyAction({ ...values, id: company.id })
          : await createCompanyAction({
              ...values,
              //@ts-ignore
              dataContact: dataContact,
            });

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingCompany,
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

  const handleClickAdd = () => {
    // const time = moment.now()
    // setAddContact((prev) => [...prev, time])
    setShowInputs(true);
    setDataContact([...dataContact, { name: "", email: "" }]);
  };
  const handleDeleteContact = (value: IContact) => {
    if (dataContact.length > 0) {
      setDataContact((prev) => prev.filter((item) => item !== value));
    }
  };

  const handChangeDataContact = (index: number, key: string, value: string) => {
    const newDataContact = [...dataContact];
    //@ts-ignore
    newDataContact[index][key] = value;
    setDataContact(newDataContact);
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
          placeholder="Enter company name"
          className={cn(errors?.name ? "border-red-400" : "")}
          defaultValue={company?.name ?? ""}
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
            errors?.salesOwner ? "text-destructive" : ""
          )}
        >
          Sales Owner
        </Label>
        <Select
          name="salesOwner"
          defaultValue={editing ? company?.salesOwner : ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {users?.map((item) => (
                <SelectItem key={item.id} value={item.name as string}>
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
        {errors?.salesOwner ? (
          <p className="text-xs text-destructive mt-2">
            {errors.salesOwner[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {/* show label add new contacts */}
      <div>
        {showInputs &&
          dataContact.map((item, index) => {
            return (
              <div className="flex space-x-2 mb-2" key={index as number}>
                <div className="flex">
                  <div className="bg-gray-200 p-1.5 rounded-l-md">
                    <User />
                  </div>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Name contact"
                    className="rounded-l-none"
                    onChange={(e) =>
                      handChangeDataContact(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="flex">
                  <div className="bg-gray-200 p-1.5 rounded-l-md">
                    <Mail />
                  </div>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Email contact"
                    className="rounded-l-none"
                    onChange={(e) =>
                      handChangeDataContact(index, "email", e.target.value)
                    }
                  />
                </div>
                <div
                  className="bg-gray-200 p-1.5 rounded-md border cursor-pointer"
                  onClick={() => handleDeleteContact(item)}
                >
                  <Trash2 />
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex space-x-2 py-5 cursor-pointer hover:opacity-70">
        <CircleFadingPlus color="#426EB4" size={20} />
        <div className="text-[#426EB4] text-sm" onClick={handleClickAdd}>
          Add new contacts
        </div>
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
              addOptimistic &&
                addOptimistic({ action: "delete", data: company });
              const error = await deleteCompanyAction(company.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: company,
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

export default CompanyForm;

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
      className="mr-2 bg-blue-400 hover:bg-blue-400"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
