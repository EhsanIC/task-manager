import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({ error: "A task title is required." })
    .trim()
    .min(1, "A task title is required.")
    .min(2, "Task titles must be at least 2 characters long."),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
