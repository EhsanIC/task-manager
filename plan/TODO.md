# Task Manager — Tier 1 Todo (feature-by-feature)

Each feature below is a self-contained slice — build it, verify it works, then move to the next. Don't build the whole DB schema or the whole backend upfront; only add what the current feature needs.

---

## Feature 1 — Project setup + schema for tasks
- [x] Set up SQLite + Drizzle ORM in the project
- [x] Define `tasks` table: `id`, `title`, `completed`, `createdAt`
- [x] Run migration (`drizzle-kit generate` + `migrate`)
- [x] **Verify:** open Drizzle Studio (or a quick script) and confirm the empty `tasks` table exists

## Feature 2 — Create a task
- [ ] Zod schema: `title` (required, min length)
- [ ] React Hook Form with the Zod resolver, single title input
- [ ] Server Action or `POST /api/tasks` Route Handler — insert into `tasks` via Drizzle
- [ ] Wire form submit → server action/route
- [ ] **Verify:** submit the form, confirm a new row appears in SQLite

## Feature 3 — List tasks
- [ ] `GET /api/tasks` Route Handler (or direct server component query) — select all from `tasks`
- [ ] Render with shadcn `Card` or `Table`
- [ ] **Verify:** tasks created in Feature 2 show up correctly on page load/refresh

## Feature 4 — Toggle complete
- [ ] Zustand store: holds task list, `toggleComplete(id)` action with optimistic update
- [ ] Checkbox on each task row, bound to store
- [ ] `PATCH /api/tasks/:id` Route Handler — update `completed` in Drizzle
- [ ] Store calls the PATCH after optimistic flip; roll back on failure
- [ ] **Verify:** click checkbox → UI updates instantly, refresh page → state persisted

## Feature 5 — Delete a task
- [ ] Delete button on each task row
- [ ] Zustand `deleteTask(id)` action — optimistic removal from list
- [ ] `DELETE /api/tasks/:id` Route Handler — delete row via Drizzle
- [ ] **Verify:** click delete → row disappears instantly, refresh page → stays gone

---

Once all 5 verify cleanly, Tier 1 is done and the full stack (Drizzle → Route Handlers → Zustand → RHF/Zod → shadcn) has been exercised end-to-end. Tier 2 can start the same way, feature by feature.