import { TaskForm } from "@/components/task-form";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full justify-center bg-muted/40 px-4 py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Task Manager
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Make progress, one task at a time.
          </h1>
          <p className="text-muted-foreground">
            Add your first task to get started.
          </p>
        </div>
        <TaskForm />
      </section>
    </main>
  );
}
