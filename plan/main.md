Tier 1 — Core (get it working end-to-end)

This is your "hello world" that touches the full stack once.

Create a task — title only (React Hook Form + Zod validation)
List tasks — fetched from SQLite via Drizzle, rendered with shadcn Card/Table
Toggle complete — checkbox, optimistic update via Zustand
Delete a task
Persist to SQLite — via Drizzle ORM, Next.js Route Handlers or Server Actions

Stack exercised: RHF + Zod (form + validation), Drizzle schema + queries, Zustand (client state), shadcn (UI primitives).

Tier 2 — Makes it actually useful
Due dates — shadcn Calendar/Popover date picker
Priority levels (low/med/high) — shadcn Select + colored badges
Edit task — reuse the same form component for create/edit
Filter/sort — by status, priority, due date (Zustand for filter UI state)
Empty states & loading states
Tier 3 — Organization
Projects/lists — group tasks (new Drizzle table + relation)
Tags — many-to-many relation in Drizzle (good relational practice)
Search — client-side filter or SQLite LIKE query
Task notes/description — longer text field, maybe markdown
Tier 4 — Polish / stretch goals
Dark mode (shadcn theming)
Keyboard shortcuts (e.g. n for new task, cmd+k command palette using shadcn Command)
Recurring tasks
Drag-and-drop reordering (dnd-kit + Zustand)
Undo delete (toast with undo action)
Local-first feel — instant UI updates, sync to SQLite in background