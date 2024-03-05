import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timestamps: { createdAt: true; updatedAt: true, creator: true } = {
  createdAt: true,
  updatedAt: true,
  creator: true
};



export type Action = "create" | "update" | "delete";

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};
