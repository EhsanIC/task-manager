# Task Manager — Tier 1 Todo (feature-by-feature)

Each feature below is a self-contained slice — build it, verify it works, then move to the next. Don't build the whole DB schema or the whole backend upfront; only add what the current feature needs.

---

## Feature 1 — Project setup + schema for tasks
- [x] Set up SQLite + Drizzle ORM in the project
- [x] Define `tasks` table: `id`, `title`, `completed`, `createdAt`
- [x] Run migration (`drizzle-kit generate` + `migrate`)
- [x] **Verify:** open Drizzle Studio (or a quick script) and confirm the empty `tasks` table exists

## Feature 2 — Create a task
- [x] Zod schema: `title` (required, min length)
- [x] React Hook Form with the Zod resolver, single title input
- [x] Server Action or `POST /api/tasks` Route Handler — insert into `tasks` via Drizzle
- [x] Wire form submit → server action/route
- [x] **Verify:** submit the form, confirm a new row appears in SQLite

## Feature 3 — List tasks
- [x] `GET /api/tasks` Route Handler (or direct server component query) — select all from `tasks`
- [x] Render with shadcn `Card` or `Table`
- [x] **Verify:** tasks created in Feature 2 show up correctly on page load/refresh

## Feature 4 — Toggle complete
- [x] Zustand store: holds task list, `toggleComplete(id)` action with optimistic update
- [x] Checkbox on each task row, bound to store
- [x] `PATCH /api/tasks/:id` Route Handler — update `completed` in Drizzle
- [x] Store calls the PATCH after optimistic flip; roll back on failure
- [x] **Verify:** click checkbox → UI updates instantly, refresh page → state persisted

## Feature 5 — Delete a task
- [x] Delete button on each task row
- [x] Zustand `deleteTask(id)` action — optimistic removal from list
- [x] `DELETE /api/tasks/:id` Route Handler — delete row via Drizzle
- [x] **Verify:** click delete → row disappears instantly, refresh page → stays gone

---

Once all 5 verify cleanly, Tier 1 is done and the full stack (Drizzle → Route Handlers → Zustand → RHF/Zod → shadcn) has been exercised end-to-end. Tier 2 can start the same way, feature by feature.

# Task Manager — Tier 2 Todo (feature-by-feature)

Same approach as Tier 1: build one feature slice, verify it, move to the next. Each feature only touches the layers it actually needs.

---

## Feature 1 — Due dates
- [ ] Add `dueDate` column to `tasks` schema (`db/schema.ts`) — nullable timestamp/text
- [ ] Generate + run migration
- [ ] Add `dueDate` to Zod schema (`lib/validations/task.ts`) — optional date
- [ ] Add shadcn `Calendar` + `Popover` date picker to the task form
- [ ] Update `POST /api/tasks` to save `dueDate`
- [ ] Show due date on each task row (Card/Table)
- [ ] **Verify:** create a task with a due date, refresh, confirm it persists and displays

## Feature 2 — Priority levels
- [ ] Add `priority` column to `tasks` schema — enum `low | medium | high`, default `medium`
- [ ] Migration
- [ ] Add `priority` to Zod schema
- [ ] Add shadcn `Select` to the task form for priority
- [ ] Colored `Badge` per priority on task rows (e.g. red/yellow/green)
- [ ] Update `POST /api/tasks` to save `priority`
- [ ] **Verify:** create tasks with different priorities, confirm correct badge color + persistence

## Feature 3 — Edit task
- [ ] Refactor task form component to accept an optional `task` prop (create vs edit mode)
- [ ] Pre-fill RHF `defaultValues` when editing
- [ ] `PATCH /api/tasks/:id` — update title, dueDate, priority via Drizzle
- [ ] Edit button/trigger (e.g. opens dialog/sheet with the same form)
- [ ] Zustand `updateTask(id, data)` action with optimistic update
- [ ] **Verify:** edit an existing task, confirm UI updates instantly and persists after refresh

## Feature 4 — Filter/sort
- [ ] Zustand: add filter state (`status`, `priority`) and sort state (`dueDate`, `priority`, `createdAt`)
- [ ] Filter/sort toolbar UI (shadcn `Select`/`ToggleGroup`) above the task list
- [ ] Derive the displayed task list from store state (filter + sort applied client-side)
- [ ] **Verify:** toggling filters/sort correctly narrows and reorders the visible list

## Feature 5 — Empty & loading states
- [ ] Empty state component — shown when the filtered list has zero tasks
- [ ] Loading/skeleton state — shown while the initial task fetch is in flight
- [ ] Wire both into the task list component based on fetch/filter state
- [ ] **Verify:** clear all tasks (or filter to none) → empty state shows; hard refresh → skeleton briefly shows before data loads

---

Once all 5 verify cleanly, Tier 2 is done — tasks now have due dates, priority, editing, filtering/sorting, and proper loading/empty UX. Tier 3 (projects, tags, search, notes) follows the same feature-by-feature pattern.