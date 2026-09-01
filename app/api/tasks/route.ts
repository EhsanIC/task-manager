import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { createTaskSchema } from "@/lib/validations/task";

export async function GET() {
  const allTasks = await db.select().from(tasks).orderBy(tasks.createdAt);

  return NextResponse.json(allTasks);
}

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

  console.log("[POST /api/tasks] Received body:", JSON.stringify(body, null, 2));
  console.log("[POST /api/tasks] dueDate type:", typeof (body as Record<string, unknown>).dueDate, "value:", (body as Record<string, unknown>).dueDate);

  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    console.error("[POST /api/tasks] Validation failed:", parsed.error.issues);
    return NextResponse.json(
      { error: "Please provide a valid task title.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const [task] = await db.insert(tasks).values(parsed.data).returning();

  return NextResponse.json(task, { status: 201 });
}
