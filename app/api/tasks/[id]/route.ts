import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { updateTaskSchema } from "@/lib/validations/task";

type TaskRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: TaskRouteContext) {
  const { id } = await context.params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId < 1) {
    return NextResponse.json({ error: "Invalid task id." }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid completion state.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const [task] = await db
    .update(tasks)
    .set({ completed: parsed.data.completed })
    .where(eq(tasks.id, taskId))
    .returning();

  if (!task) {
    return NextResponse.json({ error: "Task not found." }, { status: 404 });
  }

  return NextResponse.json(task);
}
