import { contactSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getContacts } from "@/lib/api/contacts/queries";


// Schema for contacts - used to validate API requests
const baseSchema = contactSchema.omit(timestamps)

export const insertContactSchema = baseSchema.omit({ id: true });
export const insertContactParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateContactSchema = baseSchema;
export const updateContactParams = updateContactSchema.extend({}).omit({ 
  userId: true
});
export const contactIdSchema = baseSchema.pick({ id: true });

// Types for contacts - used to type API request params and within Components
export type Contact = z.infer<typeof contactSchema>;
export type NewContact = z.infer<typeof insertContactSchema>;
export type NewContactParams = z.infer<typeof insertContactParams>;
export type UpdateContactParams = z.infer<typeof updateContactParams>;
export type ContactId = z.infer<typeof contactIdSchema>["id"];
    
// this type infers the return from getContacts() - meaning it will include any joins
export type CompleteContact = Awaited<ReturnType<typeof getContacts>>["contacts"][number];

