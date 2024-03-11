import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createStaff,
  deleteStaff,
  updateStaff,
} from "@/lib/api/staffs/mutations";
import { 
  staffIdSchema,
  insertStaffParams,
  updateStaffParams 
} from "@/lib/db/schema/staffs";

export async function POST(req: Request) {
  try {
    const validatedData = insertStaffParams.parse(await req.json());
    const { staff } = await createStaff(validatedData);

    revalidatePath("/staffs"); // optional - assumes you will have named route same as entity

    return NextResponse.json(staff, { status: 201 });
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

    const validatedData = updateStaffParams.parse(await req.json());
    const validatedParams = staffIdSchema.parse({ id });

    const { staff } = await updateStaff(validatedParams.id, validatedData);

    return NextResponse.json(staff, { status: 200 });
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

    const validatedParams = staffIdSchema.parse({ id });
    const { staff } = await deleteStaff(validatedParams.id);

    return NextResponse.json(staff, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
