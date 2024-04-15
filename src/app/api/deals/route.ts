import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createDeal,
  deleteDeal,
  updateDeal,
} from "@/lib/api/deals/mutations";
import { 
  dealIdSchema,
  insertDealParams,
  updateDealParams 
} from "@/lib/db/schema/deals";

export async function POST(req: Request) {
  try {
    const validatedData = insertDealParams.parse(await req.json());
    const { deal } = await createDeal(validatedData);

    revalidatePath("/deals"); // optional - assumes you will have named route same as entity

    return NextResponse.json(deal, { status: 201 });
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

    const validatedData = updateDealParams.parse(await req.json());
    const validatedParams = dealIdSchema.parse({ id });

    const { deal } = await updateDeal(validatedParams.id, validatedData);

    return NextResponse.json(deal, { status: 200 });
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

    const validatedParams = dealIdSchema.parse({ id });
    const { deal } = await deleteDeal(validatedParams.id);

    return NextResponse.json(deal, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
