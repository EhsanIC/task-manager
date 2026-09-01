import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { createTaskSchema } from "@/lib/validations/task";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid task title.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const [task] = await db.insert(tasks).values(parsed.data).returning();

  return NextResponse.json(task, { status: 201 });
}
