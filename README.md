# JobPulse

JobPulse is a lightweight job and follow-up management app for small commercial refrigeration service teams. It centralizes incoming requests and answers one daily question: **who needs attention today?**

Built from the [Product Requirements Document](./Product-Requirement.md) as a functional hiring-assignment prototype.

## Features

- **Today dashboard** — overdue and due-today follow-ups, pipeline counts, and upcoming work
- **Job management** — create, edit, delete, search, and filter jobs with SQLite persistence
- **Follow-up discipline** — follow-up state, recommended actions, Mark Contacted workflow, and activity timeline
- **Operational UX** — responsive layout, loading states, inline status updates, and phone `tel:` links

## Tech stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS and shadcn/ui
- Prisma ORM with SQLite

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home route is the **Today** dashboard.

### Useful scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Load demo jobs (~13 records) |
| `npm run db:studio` | Open Prisma Studio |

## Demo flow

1. Open **Today** — review overdue/due-today cards and metrics.
2. Use **Call** or **Mark contacted** on a job that needs attention.
3. Open **Jobs** — search, filter by status or follow-up, change status inline.
4. **Add job** — capture a new request (defaults: status New, follow-up today).
5. Open a job detail page — review timeline, notes, and edit fields.

## Project structure

```text
app/           Next.js routes (Today, Jobs, Add Job, detail)
components/    UI, dashboard, jobs, layout
lib/           Database client, business logic, server actions
prisma/        Schema, migrations, seed data
types/         Shared labels and enums
```

## License

Private prototype — not licensed for public distribution unless otherwise specified.
