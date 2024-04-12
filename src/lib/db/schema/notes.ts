import { noteSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getNotes } from "@/lib/api/notes/queries";


// Schema for notes - used to validate API requests
const baseSchema = noteSchema.omit(timestamps)

export const insertNoteSchema = baseSchema.omit({ id: true });
export const insertNoteParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateNoteSchema = baseSchema;
export const updateNoteParams = updateNoteSchema.extend({}).omit({ 
  userId: true
});
export const noteIdSchema = baseSchema.pick({ id: true });

// Types for notes - used to type API request params and within Components
export type Note = z.infer<typeof noteSchema>;
export type NewNote = z.infer<typeof insertNoteSchema>;
export type NewNoteParams = z.infer<typeof insertNoteParams>;
export type UpdateNoteParams = z.infer<typeof updateNoteParams>;
export type NoteId = z.infer<typeof noteIdSchema>["id"];
    
// this type infers the return from getNotes() - meaning it will include any joins
export type CompleteNote = Awaited<ReturnType<typeof getNotes>>["notes"][number];

