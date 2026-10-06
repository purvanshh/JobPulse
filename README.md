# JobPulse

A lightweight follow-up workspace for small commercial refrigeration repair businesses.

## Problem

Denise runs a commercial refrigeration repair company. Jobs arrive through phone calls, website forms, texts, referrals, repeat customers, and a notebook. Because those requests are scattered, follow-ups get missed and jobs are lost.

She does not need a full field-service platform. She needs one place to know, every morning:

- Who needs to be contacted today
- Which jobs are overdue
- Where every job currently stands

## Solution

JobPulse centralizes every service request and turns follow-up dates into an operational morning list.

Open JobPulse and immediately see who needs attention, why they need it, and what to do next.

## Core Workflow

```text
Capture Job
  → Set Status
  → Schedule Follow-up
  → Follow Up / Contact Customer
  → Schedule Work
  → Done
```

## Features

- Today dashboard with overdue and due-today follow-ups
- Recommended next actions based on job status
- Job pipeline counts (New → Waiting on Quote → Waiting on Customer → Scheduled → Done)
- Job create, edit, delete, search, and filtering
- Quick status updates from the dashboard and job list
- Mark Contacted workflow with next follow-up presets
- Lightweight contact/activity history
- Responsive layout for desktop and mobile

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- SQLite
- Lucide icons
- Zod validation
- date-fns

## Running Locally

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page is the Today dashboard.

### Useful scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma client and create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Create/apply migrations in development |
| `npm run db:seed` | Load ~13 realistic demo jobs |
| `npm run db:studio` | Open Prisma Studio |

### Environment

`.env.example` contains:

```bash
DATABASE_URL="file:./dev.db"
```

## Demo Flow

1. Open **Today** and read the attention summary.
2. Open an overdue or due-today job.
3. Use **Call** or the primary action (Contact Customer / Send Quote / Follow Up).
4. Mark contacted, add a note, and set the next follow-up.
5. Confirm the dashboard updates.
6. Open **Jobs**, search, and filter by status or follow-up.
7. Open a job detail page and review the activity timeline.
8. Move a job through Waiting on Customer → Scheduled → Done.

## Product Decisions

JobPulse intentionally focuses on lead and follow-up discipline, not technician dispatch.

Out of scope for this prototype:

- GPS / route optimization
- Advanced technician scheduling
- Invoicing and payments
- Email/SMS infrastructure
- Customer portal
- Authentication
- AI assistants or chatbots

Those may be useful later. They are not the customer’s primary pain today.

## Future Improvements

Realistic next steps, not implemented here:

- Email and website form ingestion
- SMS reminders and calling integrations
- Technician scheduling
- Quote generation and send tracking
- Customer communication history expansions

## Project Structure

```text
app/           Routes (Today, Jobs, Add Job, Job detail, Settings)
components/    Dashboard, jobs, layout, and UI primitives
lib/           Database, date helpers, follow-up logic, server actions
prisma/        Schema, migrations, seed data
types/         Shared labels for statuses and sources
```

## License

Private hiring-assignment prototype.
