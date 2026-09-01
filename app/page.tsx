import { CheckCircle2, ListTodo, Plus } from "lucide-react";
import { TaskForm } from "@/components/task-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ListTodo aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="font-heading text-base font-semibold tracking-tight">
                Task Manager
              </p>
              <p className="text-xs text-muted-foreground">Stay on top of your work</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <CheckCircle2 aria-hidden="true" className="size-4 text-primary" />
            <span>Simple. Focused. Productive.</span>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
          <div className="border-b border-border px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-8 max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Plus aria-hidden="true" className="size-3.5" />
                New task
              </div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                What needs to be done?
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Capture your next action and keep moving forward. You can always
                update it later.
              </p>
            </div>
            <TaskForm />
          </div>
          <div className="bg-muted/30 px-6 py-4 text-xs text-muted-foreground sm:px-10">
            Press <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">Enter</kbd> to add your task
          </div>
        </section>
      </div>
    </main>
  );
}
