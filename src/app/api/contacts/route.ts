import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createContact,
  deleteContact,
  updateContact,
} from "@/lib/api/contacts/mutations";
import { 
  contactIdSchema,
  insertContactParams,
  updateContactParams 
} from "@/lib/db/schema/contacts";

export async function POST(req: Request) {
  try {
    const validatedData = insertContactParams.parse(await req.json());
    const { contact } = await createContact(validatedData);

    revalidatePath("/contacts"); // optional - assumes you will have named route same as entity

    return NextResponse.json(contact, { status: 201 });
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

    const validatedData = updateContactParams.parse(await req.json());
    const validatedParams = contactIdSchema.parse({ id });

    const { contact } = await updateContact(validatedParams.id, validatedData);

    return NextResponse.json(contact, { status: 200 });
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

    const validatedParams = contactIdSchema.parse({ id });
    const { contact } = await deleteContact(validatedParams.id);

    return NextResponse.json(contact, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
