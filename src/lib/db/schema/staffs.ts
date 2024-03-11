import { staffSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getStaffs } from "@/lib/api/staffs/queries";


// Schema for staffs - used to validate API requests
const baseSchema = staffSchema.omit(timestamps)

export const insertStaffSchema = baseSchema.omit({ id: true });
export const insertStaffParams = baseSchema.extend({}).omit({ 
  id: true
});

export const updateStaffSchema = baseSchema;
export const updateStaffParams = updateStaffSchema.extend({})
export const staffIdSchema = baseSchema.pick({ id: true });

// Types for staffs - used to type API request params and within Components
export type Staff = z.infer<typeof staffSchema>;
export type NewStaff = z.infer<typeof insertStaffSchema>;
export type NewStaffParams = z.infer<typeof insertStaffParams>;
export type UpdateStaffParams = z.infer<typeof updateStaffParams>;
export type StaffId = z.infer<typeof staffIdSchema>["id"];
    
// this type infers the return from getStaffs() - meaning it will include any joins
export type CompleteStaff = Awaited<ReturnType<typeof getStaffs>>["staffs"][number];

