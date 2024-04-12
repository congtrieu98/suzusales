import { noteContactSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getNoteContacts } from "@/lib/api/noteContacts/queries";


// Schema for noteContacts - used to validate API requests
const baseSchema = noteContactSchema.omit(timestamps)

export const insertNoteContactSchema = baseSchema.omit({ id: true });
export const insertNoteContactParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateNoteContactSchema = baseSchema;
export const updateNoteContactParams = updateNoteContactSchema.extend({}).omit({ 
  userId: true
});
export const noteContactIdSchema = baseSchema.pick({ id: true });

// Types for noteContacts - used to type API request params and within Components
export type NoteContact = z.infer<typeof noteContactSchema>;
export type NewNoteContact = z.infer<typeof insertNoteContactSchema>;
export type NewNoteContactParams = z.infer<typeof insertNoteContactParams>;
export type UpdateNoteContactParams = z.infer<typeof updateNoteContactParams>;
export type NoteContactId = z.infer<typeof noteContactIdSchema>["id"];
    
// this type infers the return from getNoteContacts() - meaning it will include any joins
export type CompleteNoteContact = Awaited<ReturnType<typeof getNoteContacts>>["noteContacts"][number];

