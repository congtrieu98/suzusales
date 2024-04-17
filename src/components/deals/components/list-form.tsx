"use client";

import { Plus } from "lucide-react";
import { ListWrapper } from "./list-wrapper";

import { useState, useRef, ElementRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/components/ui/form/form-input";
import SalesStageForm from "@/components/salesStages/SalesStageForm";

export const ListForm = () => {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  // const disableEditing = () => {
  //   setIsEditing(false);
  // };

  // const onKeyDown = (e: KeyboardEvent) => {
  //   if (e.key === "Escape") {
  //     disableEditing();
  //   }
  // };

  // useEventListener("keydown", onKeyDown);
  // useOnClickOutside(formRef, disableEditing);

  if (isEditing) {
    return (
      <ListWrapper>
        {/* <form
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput
            ref={inputRef}
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent
          hover:border-input focus:border-input transition"
            placeholder="Enter title..."
          />
        </form> */}
        <div className="w-full p-3 rounded-md bg-white space-y-4 shadow-md">
          <SalesStageForm isEditing={isEditing} setIsEditing={setIsEditing} />
        </div>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={() => setIsEditing(true)}
        className="w-full rounded-md bg-gray-50 hover:bg-gray-200
        transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};
