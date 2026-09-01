"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  createTaskSchema,
  type CreateTaskInput,
} from "@/lib/validations/task";

export function TaskForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: CreateTaskInput) {
    setSubmitError(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to create the task.";
        throw new Error(message);
      }

      form.reset();
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to create the task.",
      );
    }
  }

  const titleError = form.formState.errors.title?.message;

  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-start"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex-1">
        <label className="sr-only" htmlFor="task-title">
          Task title
        </label>
        <input
          {...form.register("title")}
          aria-describedby={titleError ? "task-title-error" : undefined}
          aria-invalid={titleError ? "true" : "false"}
          className="h-10 w-full rounded-4xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          id="task-title"
          placeholder="What needs to be done?"
          type="text"
        />
        {titleError ? (
          <p className="mt-2 text-sm text-destructive" id="task-title-error">
            {titleError}
          </p>
        ) : null}
      </div>
      <Button disabled={form.formState.isSubmitting} type="submit">
        {form.formState.isSubmitting ? "Adding…" : "Add task"}
      </Button>
      {submitError ? (
        <p aria-live="polite" className="text-sm text-destructive sm:basis-full">
          {submitError}
        </p>
      ) : null}
    </form>
  );
}
