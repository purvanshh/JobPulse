# JobPulse

A morning follow-up workspace for a small commercial refrigeration repair business — open it and immediately see who needs attention today.

## Problem

Denise receives jobs through phone, website forms, texts, referrals, and a notebook. Requests get scattered, follow-ups slip, and jobs are lost. She does not need a full field-service platform. She needs one place to know who to call and where every job stands.

## Solution

JobPulse centers on a **Today** dashboard:

1. Jobs are recorded with a status and next follow-up date  
2. Today prioritizes overdue and due-today work  
3. Denise contacts the customer and records what happened  
4. The next follow-up is scheduled  
5. Jobs move through New → Waiting on Quote → Waiting on Customer → Scheduled → Done  

## Demo (about 60 seconds)

1. Open **Today** and read the attention summary  
2. Open an overdue or due-today job card  
3. Use the primary action (for example **Follow Up on Quote**)  
4. Mark the customer contacted and set the next follow-up  
5. Confirm the dashboard updates  
6. Open **Jobs**, filter by status, and inspect activity history  

## Key Product Decisions

- **Today is home** — the morning habit path should require zero hunting  
- **Scheduling is out of scope** — the customer prioritized forgotten follow-ups  
- **No AI** — recommended actions are a deterministic status map  
- **SQLite** — evaluators can run the prototype locally without infra  
- **Server Actions** — form-heavy mutations without a separate REST layer  
- **Mark Contacted does not change status** — follow-up timing and pipeline stage are separate decisions  

## Features

- Today dashboard with overdue / due-today prioritization  
- Recommended next actions by status  
- Job CRUD, search, and URL filters  
- Quick status updates  
- Mark Contacted workflow with next follow-up presets  
- Lightweight activity history  
- Responsive desktop table / mobile cards  

## Tech Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Prisma, SQLite, Zod, date-fns, Lucide, sonner, Vitest

## Architecture

```text
UI (App Router)
  ↓
Server Actions
  ↓
Business logic (lib/follow-ups, lib/dates, lib/jobs)
  ↓
Prisma
  ↓
SQLite
```

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run db:seed` | Load demo jobs |
| `npm run db:studio` | Prisma Studio |

## Testing

```bash
npm run test
```

Focused unit tests cover date-only semantics, follow-up state, recommended actions, attention prioritization, and upcoming ordering in `lib/follow-ups.test.ts`.

## Scope / Non-goals

Not included (intentionally):

- Authentication / multi-tenancy  
- Email or SMS sending  
- Actual quote transmission  
- Technician GPS, routing, or dispatch  
- Invoicing / payments  
- Customer portal  
- AI assistants  

## Future Extensions

Possible later work: inbound email/webform capture, SMS reminders, quote send tracking, technician scheduling, hosted Postgres + auth. Each should still serve “don’t lose the follow-up.”
