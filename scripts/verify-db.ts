import { createClient } from "@libsql/client";

const client = createClient({ url: "file:./tasks.db" });
const result = await client.execute(
  "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'tasks'",
);

if (result.rows.length !== 1) {
  throw new Error("The tasks table was not found.");
}

console.log("Verified: tasks table exists.");
