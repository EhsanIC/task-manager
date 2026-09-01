import { createClient } from "@libsql/client";
import { db } from "@/db";
import { tasks } from "@/db/schema";

const title = `Feature 2 verification ${Date.now()}`;
const [task] = await db.insert(tasks).values({ title }).returning();

if (!task || task.title !== title || task.completed !== false) {
  throw new Error("Task creation verification failed.");
}

const client = createClient({ url: "file:./tasks.db" });
const result = await client.execute({
  sql: "SELECT title, completed FROM tasks WHERE id = ?",
  args: [task.id],
});

if (result.rows.length !== 1 || result.rows[0]?.title !== title) {
  throw new Error("Created task was not persisted in SQLite.");
}

console.log("Verified: task creation persists a new task.");
