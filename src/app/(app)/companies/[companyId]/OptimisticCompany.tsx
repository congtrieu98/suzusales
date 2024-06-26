"use client";

import { useOptimistic, useRef, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/companies/useOptimisticCompanies";
import { CompleteCompany, type Company } from "@/lib/db/schema/companies";
import { Action, cn, formatDateSlash } from "@/lib/utils";

import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  AlignLeft,
  Archive,
  BadgeDollarSign,
  Edit,
  Pencil,
  Quote,
  User,
  User2,
  Users,
} from "lucide-react";
import { DataTableContact } from "@/components/contacts/table/data-table";
import { columnsContact } from "@/components/contacts/table/columns";
import { CompleteUser } from "@/lib/db/schema/users";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import moment from "moment";
import { updateCompanyAction } from "@/lib/actions/companies";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createNoteAction } from "@/lib/actions/notes";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { CompleteNote, Note, insertNoteParams } from "@/lib/db/schema/notes";

export default function OptimisticCompany({
  company,
  users,
}: {
  company: CompleteCompany;
  users: CompleteUser[];
}) {
  const { data: session } = useSession();
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Note>(insertNoteParams);
  const [optimisticCompany, setOptimisticCompany] = useOptimistic(company);
  const updateCompany: TAddOptimistic = (input) =>
    setOptimisticCompany({ ...input.data });
  const [clickTitleCompany, setClickTitleCompany] = useState(false);
  const [clickSalesOwner, setClickSalesOwner] = useState(false);
  const [changeTitle, setChangeTitle] = useState("");
  const [changeInputNote, setChangeInputNote] = useState("");
  const [openTextArea, setOpenTextArea] = useState(false);

  const focusInput = useRef(null);
  const router = useRouter();

  const onSuccess = (action: Action) => {
    router.refresh();
    toast.success(`Note ${action}d!`);
  };

  const infoSalesOwner = users.find((u) => u?.name === company?.salesOwner);

  const handleClickTitleCompany = () => {
    setClickTitleCompany(!clickTitleCompany);
    //@ts-ignore
    focusInput?.current?.focus();
  };

  const handleClickSalesOwner = () => {
    setClickSalesOwner(!clickSalesOwner);
  };

  const handleChangeTitle = (val: string) => {
    setChangeTitle(val);
  };

  const handleClickInputNote = async () => {
    try {
      if (changeInputNote !== "") {
        await createNoteAction({
          content: changeInputNote,
          companyId: company.id,
        });
        setChangeInputNote("");
        onSuccess("create");
      }
    } catch (error) {
      toast.error("Create faild");
    }
  };
  const handleSave = async () => {
    try {
      if (changeTitle !== "") {
        await updateCompanyAction({
          id: company.id,
          name: changeTitle,
          salesOwner: company.salesOwner,
        });
        setClickTitleCompany(!clickTitleCompany);
        onSuccess("update");
      }
    } catch (error) {
      toast.error("Update faild");
    }
  };

  const handleSubmitTextArea = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const noteParsed = await insertNoteParams.safeParseAsync({
      ...payload,
    });
    if (!noteParsed.success) {
      setErrors(noteParsed?.error.flatten().fieldErrors);
      return;
    }
    const values = noteParsed.data;
    const pendingNote: CompleteNote = {
      updatedAt: company?.updatedAt ?? new Date(),
      createdAt: company?.createdAt ?? new Date(),
      id:
        company?.notes?.find((item) => item?.companyId === company?.id)?.id ??
        "",
      userId: company?.userId,
      company: company,
      user: company?.user!,
      ...values,
    };
    console.log("dataArea:", values);
    console.log("error:", errors);
  };

  const handlerChangeSalesOwner = async (val: string) => {
    try {
      if (val !== "") {
        await updateCompanyAction({
          id: company.id,
          name: company.name,
          salesOwner: val,
        });
        setClickSalesOwner(!clickSalesOwner);
        onSuccess("update");
      }
    } catch (error) {
      toast.error("Update faild");
    }
  };

  // console.log("company:", company);

  return (
    <div className="p-5 bg-gray-100 ">
      {/* Header content */}
      <div className="flex space-x-4">
        <div className="logo w-24 h-24 rounded-lg bg-orange-400 shadow-lg"></div>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <div className="text-xxl font-bold">
              {changeTitle !== "" ? changeTitle : company?.name}
            </div>
            <Pencil
              size={18}
              className="cursor-pointer"
              onClick={handleClickTitleCompany}
              color="#808080"
            />
          </div>
          {clickTitleCompany && (
            <div className="flex w-full space-x-2">
              <Input
                type="text"
                ref={focusInput}
                onChange={(e) => handleChangeTitle(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gray-300 p-2 rounded-md"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          )}

          <div className="flex">
            <div className="text-gray-500 mr-3 mt-1">Sales Owner:</div>
            <div className="text-gray-500 mr-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={infoSalesOwner?.image!}
                  alt={infoSalesOwner?.name!}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex space-x-2">
              <div className="text-gray-500 mt-1">
                {clickSalesOwner ? (
                  <Select
                    defaultValue={company?.salesOwner}
                    onValueChange={(val) => handlerChangeSalesOwner(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {users?.map((item) => (
                          <SelectItem key={item.id} value={item.name as string}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  company.salesOwner
                )}
              </div>

              <Pencil
                size={18}
                onClick={handleClickSalesOwner}
                color="#808080"
                className="mt-0.5 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="mt-10">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          <div className="md:col-span-3">
            <div className="bg-white py-4 px-6 rounded-xl shadow-lg mb-10">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-3">
                  <Users size={20} />
                  <div className="font-medium">Contacts</div>
                </div>
                <div className="text-sm text-gray-300">
                  Total contact: {company?.contacts?.length}
                </div>
              </div>
              <DataTableContact
                columns={columnsContact}
                //@ts-ignore
                data={company?.contacts?.length > 0 ? company?.contacts : []}
              />
            </div>

            {/* Deals */}
            <div className="bg-white py-4 px-6 rounded-xl shadow-lg mb-10">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-3">
                  <BadgeDollarSign size={20} />
                  <div className="font-medium">Deals</div>
                </div>
                <div className="text-sm text-gray-300">
                  Total contact: {company?.contacts?.length}
                </div>
              </div>
              <DataTableContact
                columns={columnsContact}
                //@ts-ignore
                data={company?.contacts?.length > 0 ? company?.contacts : []}
              />
            </div>

            {/* Quote */}
            <div className="bg-white py-4 px-6 rounded-xl shadow-lg mb-10">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-3">
                  <Quote size={20} />
                  <div className="font-medium">Quotes</div>
                </div>
                <div className="text-sm text-gray-300">
                  Total contact: {company?.contacts?.length}
                </div>
              </div>
              <DataTableContact
                columns={columnsContact}
                //@ts-ignore
                data={company?.contacts?.length > 0 ? company?.contacts : []}
              />
            </div>

            {/* Notes */}
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
                <Input
                  type="text"
                  onChange={(e) => setChangeInputNote(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-gray-100 p-2 rounded-md"
                  onClick={handleClickInputNote}
                  disabled={changeInputNote === ""}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="bg-gray-50 py-4 px-6 rounded-b-xl shadow-lg">
              {company.notes.map((n) => {
                return (
                  <div className="" key={n?.id}>
                    {/* info user note */}

                    <div className="flex space-y-2">
                      <div className="avatar mr-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            //@ts-ignore
                            src={n?.user?.image!}
                            //@ts-ignore
                            alt={n?.user?.name!}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex justify-between w-full">
                        <div className="font-normal">
                          {/* @ts-ignore */}
                          {n?.user?.name!}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {moment(n?.createdAt).format(formatDateSlash)}
                        </div>
                      </div>
                    </div>

                    {/* content */}
                    {openTextArea &&
                    // @ts-ignore
                    session?.user?.id === n?.user?.id ? (
                      <form
                        action={handleSubmitTextArea}
                        onChange={handleChange}
                      >
                        <Textarea
                          name="content"
                          placeholder="Type your message here."
                          className=" mr-2 my-2"
                          defaultValue={n?.content ?? ""}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-sm p-1.5 border rounded-md hover:border-blue-400"
                            onClick={() => setOpenTextArea(false)}
                          >
                            <div className="hover:text-blue-400">Cancel</div>
                          </button>
                          <button
                            type="submit"
                            className="text-sm p-1.5 border rounded-md bg-blue-600 hover:border-blue-600 text-white hover:opacity-80"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-sm ml-9 p-4 bg-white mt-2 rounded-lg shadow-lg  mb-3">
                        {n?.content}
                      </div>
                    )}

                    {/* Action edit and delete notes */}
                    {
                      // @ts-ignore
                      session?.user?.id === n.user.id && (
                        <div className="flex space-x-5 text-[#808080] text-sm ml-9">
                          <div
                            className="hover:text-blue-400 cursor-pointer"
                            onClick={() => setOpenTextArea(!openTextArea)}
                          >
                            Edit
                          </div>
                          <div className="hover:text-red-500 cursor-pointer">
                            Delete
                          </div>
                        </div>
                      )
                    }
                  </div>
                );
              })}
            </div>
          </div>

          {/* Company info */}
          <div className="">
            <div className="px-3 py-4 bg-gray-50 rounded-t-md">
              <div className="flex space-x-2">
                <Archive size={20} className="" />
                <div className="font-medium text">Company Info</div>
              </div>
            </div>
            <div className="space-y-4 bg-white rounded-b-md">
              <div className="border-b-2 p-2">
                <div className="flex space-x-2">
                  <div className="icon">
                    <User size={20} className="" />
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="text-sm font-light">Company size</div>
                    <Edit size={20} />
                  </div>
                </div>
                <div className="ml-8">
                  <div className="text-sm font-light uppercase">Medium</div>
                </div>
              </div>

              <div className="border-b-2 p-2">
                <div className="flex space-x-2">
                  <div className="icon">
                    <User size={20} className="" />
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="text-sm font-light">Total revenue</div>
                    <Edit size={20} />
                  </div>
                </div>
                <div className="ml-8">
                  <div className="text-sm font-light uppercase">Medium</div>
                </div>
              </div>

              <div className="border-b-2 p-2">
                <div className="flex space-x-2">
                  <div className="icon">
                    <User size={20} className="" />
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="text-sm font-light">Country</div>
                    <Edit size={20} />
                  </div>
                </div>
                <div className="ml-8">
                  <div className="text-sm font-light uppercase">Viet nam</div>
                </div>
              </div>

              <div className="border-b-2 p-2">
                <div className="flex space-x-2">
                  <div className="icon">
                    <User size={20} className="" />
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="text-sm font-light">Website</div>
                    <Edit size={20} />
                  </div>
                </div>
                <div className="ml-8">
                  <div className="text-sm font-light uppercase">Website</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
