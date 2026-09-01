import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high"]);

const dueDateSchema = z
  .union([z.string().date(), z.date(), z.literal("")])
  .optional()
  .nullable()
  .transform((value) => {
    if (!value || value === "") return null;
    if (value instanceof Date) return value;
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  });

const taskFields = {
  title: z
    .string({ error: "A task title is required." })
    .trim()
    .min(1, "A task title is required.")
    .min(2, "Task titles must be at least 2 characters long."),
  dueDate: dueDateSchema,
  priority: prioritySchema,
};

export const createTaskSchema = z.object({
  ...taskFields,
  priority: prioritySchema.default("medium"),
});

export const updateTaskSchema = z.object({
  completed: z.boolean().optional(),
  title: taskFields.title.optional(),
  dueDate: dueDateSchema,
  priority: prioritySchema.optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: "At least one task field is required.",
});

export type CreateTaskInput = z.input<typeof createTaskSchema>;
export type UpdateTaskInput = z.input<typeof updateTaskSchema>;
export type Priority = z.infer<typeof prioritySchema>;
