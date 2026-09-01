export default function Loading() {
  return (
    <main className="min-h-screen bg-muted/40 px-4 py-8 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-3xl animate-pulse rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-10">
        <div className="mb-8 h-8 w-56 rounded bg-muted" />
        <div className="mb-3 h-4 w-40 rounded bg-muted" />
        <div className="h-10 w-full rounded-4xl bg-muted" />
        <div className="mt-10 h-6 w-24 rounded bg-muted" />
        <div className="mt-5 space-y-3"><div className="h-16 rounded-2xl bg-muted" /><div className="h-16 rounded-2xl bg-muted" /></div>
      </div>
    </main>
  );
}
