import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { updateTaskSchema } from "@/lib/validations/task";

type TaskRouteContext = {
  params: Promise<{ id: string }>;
};

function parseTaskId(id: string) {
  const taskId = Number(id);
  return Number.isInteger(taskId) && taskId > 0 ? taskId : null;
}

export async function DELETE(_request: Request, context: TaskRouteContext) {
  const taskId = parseTaskId((await context.params).id);
  if (taskId === null) {
    return NextResponse.json({ error: "Invalid task id." }, { status: 400 });
  }

  const [task] = await db.delete(tasks).where(eq(tasks.id, taskId)).returning();
  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, context: TaskRouteContext) {
  const taskId = parseTaskId((await context.params).id);
  if (taskId === null) {
    return NextResponse.json({ error: "Invalid task id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide valid task data.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const [task] = await db
    .update(tasks)
    .set(parsed.data)
    .where(eq(tasks.id, taskId))
    .returning();

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json(task);
}
