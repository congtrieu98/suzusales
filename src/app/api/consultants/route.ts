import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createConsultant,
  deleteConsultant,
  updateConsultant,
} from "@/lib/api/consultants/mutations";
import {
  consultantIdSchema,
  insertConsultantParamsCustom,
  updateConsultantParams
} from "@/lib/db/schema/consultants";

export async function POST(req: Request) {
  try {
    const validatedData = insertConsultantParamsCustom.parse(await req.json());
    const { consultant } = await createConsultant(validatedData);

    revalidatePath("/consultants"); // optional - assumes you will have named route same as entity

    return NextResponse.json(consultant, { status: 201 });
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

    const validatedData = updateConsultantParams.parse(await req.json());
    const validatedParams = consultantIdSchema.parse({ id });

    const { consultant } = await updateConsultant(validatedParams.id, validatedData);

    return NextResponse.json(consultant, { status: 200 });
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

    const validatedParams = consultantIdSchema.parse({ id });
    const { consultant } = await deleteConsultant(validatedParams.id);

    return NextResponse.json(consultant, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
