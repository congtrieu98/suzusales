import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createSalesStage,
  deleteSalesStage,
  updateSalesStage,
} from "@/lib/api/salesStages/mutations";
import { 
  salesStageIdSchema,
  insertSalesStageParams,
  updateSalesStageParams 
} from "@/lib/db/schema/salesStages";

export async function POST(req: Request) {
  try {
    const validatedData = insertSalesStageParams.parse(await req.json());
    const { salesStage } = await createSalesStage(validatedData);

    revalidatePath("/salesStages"); // optional - assumes you will have named route same as entity

    return NextResponse.json(salesStage, { status: 201 });
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

    const validatedData = updateSalesStageParams.parse(await req.json());
    const validatedParams = salesStageIdSchema.parse({ id });

    const { salesStage } = await updateSalesStage(validatedParams.id, validatedData);

    return NextResponse.json(salesStage, { status: 200 });
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

    const validatedParams = salesStageIdSchema.parse({ id });
    const { salesStage } = await deleteSalesStage(validatedParams.id);

    return NextResponse.json(salesStage, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
