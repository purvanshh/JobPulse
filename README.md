# JobPulse

A morning follow-up workspace for a small commercial refrigeration repair business — open it and immediately see who needs attention today.

## Problem

Denise receives jobs through phone, website forms, texts, referrals, and a notebook. Requests get scattered, follow-ups slip, and jobs are lost. She does not need a full field-service platform. She needs one place to know who to call and where every job stands.

## Approach

I treated the call as a scope document. Denise already runs the company. The failure she paid for was a Friday freezer job that never got a follow-up and was gone by Monday, about $2,000. She also cannot tell her husband how many jobs are open. Asked for one screen, she named two things: who to call this morning, and where each job stands — waiting on a quote, waiting on a yes, scheduled, or done. Technician schedules, she said, can wait. Volume is about 15–20 new requests a week. The same small set of jobs is scattered across five places.

That splits the work into a place and a clock. Status answers where the job is. A follow-up date answers when she has to act. A job can be correctly “Waiting on Quote” and still be two days late, so every open job carries both. Today sorts by the date: overdue before due today, and the oldest slip first, because the longest silence is the job most likely to walk. Done jobs leave that list. There is nothing left to call about, and they should not inflate the open count.

Incoming channels needed an intermediate layer. Requests land in **Inbox** first (phone, website, email, text, referral, notebook). Denise reviews, then converts to a Job — customer, phone, email, description, and source carry over. From there the existing status + follow-up loop takes over. Real Gmail/SMS/telephony are out of scope; simulated intake and `POST /api/inbound/[source]` prove the same pipeline.

The morning loop stays short on purpose. Today shows overdue follow-ups, due-today work, and new inbound requests with a primary action on each card. Marking someone contacted writes what happened and asks for the next date. It leaves pipeline status alone unless she changes it. A phone call is a different decision from “they accepted the quote” or “a tech is booked.”

Scheduling, invoicing, texting, and login stay out of this prototype. She already knows where the four techs are. The lost revenue was a forgotten follow-up. Adding those surfaces would turn the first screen into a field-service suite. The first screen has to stay the call list.

SQLite and Server Actions follow the same constraint. The prototype has to run from a checkout, keep real jobs, and refresh the morning list after a click. Dates are compared as calendar days in local time, so “today” stays the day on her machine for a single operator.

## Solution

JobPulse centers on three screens:

1. **Today** — who needs attention (overdue, due today, new requests) and what to do next  
2. **Inbox** — incoming requests before they become jobs  
3. **Jobs** — full pipeline with status, follow-up state, and source filters  

Morning loop:

1. Request arrives (any channel) → Inbox as NEW  
2. Denise reviews and converts to a Job  
3. Job gets a status + next follow-up date  
4. Today prioritizes overdue and due-today work  
5. She records the contact, sets the next follow-up  
6. Jobs move New → Waiting on Quote → Waiting on Customer → Scheduled → Done  

## Demo (about 60 seconds)

Live Demo: [Prototype](https://job-pulse-smoky-nine.vercel.app/)

1. Open **Today** — read “N people need attention”  
2. Handle an overdue or due-today card with **Follow Up** (note + next date)  
3. Open a **New request** card → Review → **Convert to Job**  
4. On the job, set status (e.g. Waiting on Quote) and confirm follow-up  
5. Confirm the job appears under Needs Attention when due  
6. Open **Jobs**, filter by status / follow-up / source  

Optional: submit `/request-service` or use **Simulate incoming** on Inbox.

## Key Product Decisions

- **Today is home** — morning habit path should require zero hunting  
- **Inbox before Jobs** — requests are not jobs until Denise converts them  
- **Status ≠ follow-up** — pipeline stage and when to call are separate  
- **Scheduling is out of scope** — customer prioritized forgotten follow-ups  
- **No AI** — recommended actions are a deterministic status map  
- **SQLite** — evaluators can run the prototype locally without infra  
- **Server Actions** — form-heavy mutations without a separate REST layer  
- **Mark contacted does not force a status change** — unless Denise chooses one  

## Features

- Today command center: overdue, due today, new inbound — each with a primary action  
- Fast follow-up dialog: note + next date (+ optional status) in one step  
- Unified Inbox for PHONE / WEBSITE / EMAIL / TEXT / REFERRAL / NOTEBOOK  
- Convert inbound → Job (idempotent), with activity history and linked original request  
- Quick-add + simulate intake; public `/request-service`; `POST /api/inbound/[source]`  
- Job CRUD, search, status / follow-up / source filters  
- Activity timeline (contacted, status changes, follow-up scheduled, conversion)  
- Responsive desktop / mobile layout  

## What is real vs future integration

| Implemented now | Not in this prototype |
| --- | --- |
| Persisted Inbox → Job → Follow-up → Today | Real Gmail / SMS / telephony |
| Simulated + website + API intake | Auth / multi-tenant |
| Activity history on jobs | Quote email sending |
| Status + follow-up semantics | Tech dispatch, GPS, invoicing, payments |

## Tech Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Prisma, SQLite, Zod, date-fns, Lucide, sonner, Vitest

## Architecture

```text
UI (App Router)
  ↓
Server Actions (+ POST /api/inbound/[source])
  ↓
Business logic (lib/follow-ups, lib/inbound, lib/dates, lib/jobs)
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
| `npm run db:seed` | Load demo jobs + inbound requests |
| `npm run db:studio` | Prisma Studio |

## Testing

```bash
npm run test
```

Unit tests cover date-only semantics, follow-up state, recommended actions, attention prioritization, upcoming ordering (`lib/follow-ups.test.ts`), and inbound validation/sorting (`lib/inbound.test.ts`).

## Scope / Non-goals

Not included (intentionally):

- Authentication / multi-tenancy  
- Real email or SMS sending / telephony  
- Actual quote transmission  
- Technician GPS, routing, or dispatch  
- Invoicing / payments  
- Customer portal  
- AI assistants  

## Future Extensions

Possible later work: real inbound email/webform webhooks, SMS reminders, quote send tracking, technician scheduling, hosted Postgres + auth. Each should still serve “don’t lose the follow-up.”
