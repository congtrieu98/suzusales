import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createNoteContact,
  deleteNoteContact,
  updateNoteContact,
} from "@/lib/api/noteContacts/mutations";
import { 
  noteContactIdSchema,
  insertNoteContactParams,
  updateNoteContactParams 
} from "@/lib/db/schema/noteContacts";

export async function POST(req: Request) {
  try {
    const validatedData = insertNoteContactParams.parse(await req.json());
    const { noteContact } = await createNoteContact(validatedData);

    revalidatePath("/noteContacts"); // optional - assumes you will have named route same as entity

    return NextResponse.json(noteContact, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateNoteContactParams.parse(await req.json());
    const validatedParams = noteContactIdSchema.parse({ id });

    const { noteContact } = await updateNoteContact(validatedParams.id, validatedData);

    return NextResponse.json(noteContact, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = noteContactIdSchema.parse({ id });
    const { noteContact } = await deleteNoteContact(validatedParams.id);

    return NextResponse.json(noteContact, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
