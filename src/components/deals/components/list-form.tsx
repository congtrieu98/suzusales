"use client";

import { Plus } from "lucide-react";
import { ListWrapper } from "./list-wrapper";

import { useState } from "react";
import SalesStageForm from "@/components/salesStages/SalesStageForm";

export const ListForm = () => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ListWrapper>
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
        className="w-full rounded-md bg-gray-50 hover:bg-gray-200 shadow-md
        transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};
