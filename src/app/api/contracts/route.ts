import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createContract,
  deleteContract,
  updateContract,
} from "@/lib/api/contracts/mutations";
import { 
  contractIdSchema,
  insertContractParams,
  updateContractParams 
} from "@/lib/db/schema/contracts";

export async function POST(req: Request) {
  try {
    const validatedData = insertContractParams.parse(await req.json());
    const { contract } = await createContract(validatedData);

    revalidatePath("/contracts"); // optional - assumes you will have named route same as entity

    return NextResponse.json(contract, { status: 201 });
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

    const validatedData = updateContractParams.parse(await req.json());
    const validatedParams = contractIdSchema.parse({ id });

    const { contract } = await updateContract(validatedParams.id, validatedData);

    return NextResponse.json(contract, { status: 200 });
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

    const validatedParams = contractIdSchema.parse({ id });
    const { contract } = await deleteContract(validatedParams.id);

    return NextResponse.json(contract, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}