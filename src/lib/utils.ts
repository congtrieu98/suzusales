import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
};

export type Action = "create" | "update" | "delete";

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};

export const currencyNumber = (
  value: number,
  options?: Intl.NumberFormatOptions,
) => {
  if (
    typeof Intl === "object" &&
    Intl &&
    typeof Intl.NumberFormat === "function"
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      ...options,
    }).format(value);
  }

  return value.toString();
};

export const formatDate = "DD-MM-YYYY";
export const formatDatetime = "YYYY-MM-DD HH:mm";
export const formatTimeDate = "HH:mm DD/MM/YYYY";
export const formatDateFull = "YYYY-MM-DD[T]HH:mm:ss[Z]";
export const formatDateAPi = "YYYY-MM-DD";
export const formatDateSlash = "DD/MM/YYYY HH:mm";
export const formatNo = "YYYY-MM-DDThh:mm";