# JobPulse
## Product Requirements Document (PRD)

**Document Version:** 1.0  
**Status:** Implementation Specification  
**Product Type:** Small Business Job & Follow-up Management Platform  
**Primary User:** Denise — Owner, Commercial Refrigeration Repair Company  
**Prototype Objective:** Functional hiring-assignment prototype

---

# 1. Executive Summary

JobPulse is a lightweight job and follow-up management application designed for a small commercial refrigeration repair business.

The business receives service requests through multiple channels including phone calls, website forms/emails, text messages, referrals, repeat customers, and a physical notebook. Because these requests are fragmented across multiple locations, jobs can be forgotten and customer follow-ups can be missed.

The core product problem is therefore not technician scheduling or complex field-service management.

It is:

> **Helping the business owner know exactly who needs attention today and where every job currently stands.**

JobPulse centralizes job information into one operational workspace and provides a daily "Needs Attention" view containing overdue and due-today follow-ups.

The product is intentionally small and focused. It prioritizes operational clarity and follow-up discipline over feature breadth.

---

# 2. Customer Context

The customer is Denise, owner of a commercial refrigeration repair company.

The company:

- Repairs walk-in coolers
- Repairs freezers
- Repairs ice machines
- Serves restaurants
- Serves grocery stores
- Serves warehouses
- Has four field technicians
- Has approximately 15–20 new requests per week in addition to repeat work

Current job intake occurs through:

- Office phone
- Website form/email
- Text messages
- Repeat customers
- Referrals
- Physical notebook

The customer currently lacks a centralized operational view.

The result is that follow-ups are missed, jobs are forgotten, and potential revenue is lost. In the interview transcript, Denise describes a case where a restaurant's freezer repair request was forgotten and the customer eventually hired someone else, resulting in approximately a $2,000 lost job.

---

# 3. Problem Statement

## Current Problem

Job information is distributed across multiple communication channels.

There is no reliable centralized workflow for answering:

- What new jobs came in?
- Which customers are waiting for a quote?
- Which customers are waiting for a response?
- Which jobs have been scheduled?
- Which jobs are overdue for follow-up?
- Which customers need to be contacted today?
- How many open jobs exist?

The customer explicitly states that she cannot reliably track where jobs are in the process or provide a clear count of open jobs.

## Core Pain Point

> **Follow-up leakage caused by fragmented job tracking.**

---

# 4. Product Vision

JobPulse should become the single operational screen Denise opens every morning.

The product should answer one question immediately:

> **"Who do I need to call today?"**

And a second question immediately afterward:

> **"Where is every job in the process?"**

The customer explicitly describes this as the ideal outcome: a daily list of people waiting on quotes, customers who need scheduling, and customers who have not heard back.

---

# 5. Product Goals

## Primary Goals

### G1 — Centralize Jobs

Provide one place to record every service request regardless of how the request originally arrived.

### G2 — Prevent Missed Follow-ups

Identify overdue and due-today follow-ups automatically.

### G3 — Provide Operational Visibility

Show the current status of every active job.

### G4 — Reduce Daily Cognitive Load

Allow Denise to understand her workload within seconds of opening the application.

### G5 — Enable Fast Updates

Allow common actions such as changing status and scheduling the next follow-up without unnecessary navigation.

---

# 6. Non-Goals

The following are explicitly outside the MVP/prototype scope:

- Technician GPS tracking
- Route optimization
- Advanced technician dispatch
- Payroll
- Invoicing
- Payment processing
- Customer portal
- Complex scheduling system
- SMS infrastructure
- Email infrastructure
- Full accounting
- Advanced analytics
- AI chatbot
- AI assistant
- Complex CRM functionality

The customer explicitly states that technician schedules would be useful later, but that leads and follow-ups are the main priority.

This constraint is intentional.

---

# 7. Target User

## Primary User

### Denise — Business Owner

Denise is:

- The primary person receiving/handling incoming requests
- Responsible for customer follow-ups
- Responsible for deciding job status
- The person who needs the operational overview
- Not necessarily technically sophisticated
- Managing a relatively small job volume

The interface should therefore prioritize:

- Simplicity
- Speed
- Clear language
- Immediate visibility
- Minimal configuration

---

# 8. Core User Journey

The primary workflow is:

```text
Job Request Arrives
        ↓
Create Job
        ↓
Set Status
        ↓
Set Follow-up Date
        ↓
Job Appears in Dashboard
        ↓
Follow-up Becomes Due
        ↓
Denise Contacts Customer
        ↓
Update Activity
        ↓
Set Next Follow-up / Change Status
        ↓
Scheduled
        ↓
Done
```

This workflow is the foundation of the entire application.

---

# 9. Product Workflow

## 9.1 Job Intake

Denise creates a job whenever a new request arrives.

Example:

```text
Customer:
ABC Restaurant

Job:
Walk-in freezer not maintaining temperature

Source:
Phone

Status:
New

Next Follow-up:
Today
```

---

## 9.2 Job Tracking

The job progresses through a simple status lifecycle:

```text
NEW
  ↓
WAITING ON QUOTE
  ↓
WAITING ON CUSTOMER
  ↓
SCHEDULED
  ↓
DONE
```

Not every job must follow exactly this path, but these statuses represent the primary operational states.

---

# 10. Status Definitions

| Status | Meaning |
|---|---|
| New | Newly received request requiring initial action |
| Waiting on Quote | Quote needs to be prepared/sent or is awaiting quote-related action |
| Waiting on Customer | Customer response/approval is required |
| Scheduled | Customer has agreed and work has been scheduled |
| Done | Job is completed |

The terminology intentionally follows the customer's own description of the workflow: "waiting on a quote, waiting on their yes, scheduled, done."

---

# 11. Follow-up Model

Every active job can have a `nextFollowUp` date.

The system derives the follow-up state from this date.

## Overdue

```text
nextFollowUp < today
AND status != DONE
```

## Due Today

```text
nextFollowUp == today
AND status != DONE
```

## Upcoming

```text
nextFollowUp > today
AND status != DONE
```

## Completed

```text
status == DONE
```

Completed jobs are excluded from active follow-up calculations.

---

# 12. Recommended Actions

JobPulse should infer the most useful next action from the job status.

| Status | Recommended Action |
|---|---|
| New | Contact Customer |
| Waiting on Quote | Send Quote |
| Waiting on Customer | Follow Up |
| Scheduled | View Job / Check Schedule |
| Done | No Action |

This is deterministic product logic rather than AI.

The system should not introduce AI merely for the sake of adding an AI feature.

---

# 13. Core Application Screens

## 13.1 Today Dashboard

Primary application screen.

Purpose:

> Tell Denise what requires attention right now.

### Header

```text
Good morning, Denise

Here's what needs your attention today.
```

### Summary Metrics

- Follow-ups Today
- Overdue
- Open Jobs
- Scheduled

### Needs Attention

Contains:

1. Overdue jobs
2. Due-today jobs

Sorted by urgency.

### Coming Up

Shows upcoming follow-ups.

### Pipeline

Displays counts for:

- New
- Waiting on Quote
- Waiting on Customer
- Scheduled
- Done

---

# 14. Jobs Screen

The Jobs screen provides the complete job list.

Columns:

- Customer
- Company
- Job
- Status
- Follow-up
- Source
- Created
- Actions

Capabilities:

- Search
- Status filter
- Follow-up filter
- Open job
- Edit job
- Delete job
- Change status

---

# 15. Add Job Screen

The Add Job screen allows fast creation of a new request.

## Customer

- Customer Name
- Company
- Phone

## Job

- Job Description
- Source
- Status

## Follow-up

- Next Follow-up

## Notes

- Notes

Required fields:

- Customer Name
- Job Description

Defaults:

```text
Status = NEW
Source = OTHER
Next Follow-up = Today
```

---

# 16. Job Detail Screen

The job detail screen contains:

## Customer Information

- Customer
- Company
- Phone

## Job Information

- Description
- Source
- Status

## Follow-up

- Next follow-up
- Follow-up state
- Recommended action

## Notes

Free-form job notes.

## Activity Timeline

Example:

```text
Today
Customer contacted
"Spoke with manager. Quote requested."

Yesterday
Quote sent

Oct 4
Job created
```

---

# 17. Quick Actions

The system should minimize navigation for common operations.

Examples:

```text
[Call]

[Follow Up]

[Mark Contacted]

[Change Status]

[Set Follow-up]
```

If a phone number exists:

```text
tel:+123456789
```

should be used for the Call action.

If there is no phone number, the interface should not display a broken call action.

---

# 18. Mark Contacted Workflow

When Denise selects:

```text
Mark Contacted
```

the system should:

1. Record an activity.
2. Allow Denise to add an optional note.
3. Ask for the next follow-up date.

Options:

```text
Tomorrow
In 3 Days
Next Week
Custom
```

The system then updates the job.

---

# 19. Activity Model

Activities provide lightweight historical context.

### Activity

```text
id
jobId
type
note
createdAt
```

Activity types:

```text
CONTACTED
NOTE
STATUS_CHANGED
```

The activity system should remain intentionally lightweight.

It is not intended to become a full CRM communication history.

---

# 20. Data Model

## Job

```text
Job
├── id
├── customerName
├── company
├── phone
├── jobDescription
├── source
├── status
├── nextFollowUp
├── notes
├── createdAt
└── updatedAt
```

## Activity

```text
Activity
├── id
├── jobId
├── type
├── note
└── createdAt
```

Relationship:

```text
Job 1 ───────── * Activity
```

Deleting a job should appropriately remove associated activity records.

---

# 21. Source Types

Jobs can originate from:

```text
PHONE
WEBSITE
TEXT
REFERRAL
REPEAT_CUSTOMER
OTHER
```

This reflects the actual fragmented intake channels described by the customer.

---

# 22. Technical Architecture

## High-Level Architecture

```text
                    ┌──────────────────────┐
                    │      JobPulse UI     │
                    │      Next.js         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Server Actions / API │
                    │ Business Logic       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Prisma         │
                    │         ORM          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       SQLite         │
                    │      Database        │
                    └──────────────────────┘
```

---

# 23. Technology Stack

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Backend

- Next.js server-side functionality
- Server Actions / API routes where appropriate

## Database

- SQLite

## ORM

- Prisma

## Development

- Git
- npm/pnpm depending on existing repository configuration

The implementation should avoid unnecessary infrastructure because this is a focused prototype rather than a production-scale enterprise system.

---

# 24. Repository Structure

The recommended repository structure is:

```text
jobpulse/
│
├── app/
│   ├── page.tsx
│   │
│   ├── today/
│   │   └── page.tsx
│   │
│   ├── jobs/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   └── ...
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   │
│   ├── dashboard/
│   │   ├── SummaryMetrics.tsx
│   │   ├── NeedsAttention.tsx
│   │   ├── UpcomingFollowUps.tsx
│   │   └── PipelineSummary.tsx
│   │
│   ├── jobs/
│   │   ├── JobTable.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobForm.tsx
│   │   ├── JobStatusBadge.tsx
│   │   ├── JobFilters.tsx
│   │   └── JobDetail.tsx
│   │
│   └── ui/
│       └── ...
│
├── lib/
│   ├── db.ts
│   ├── jobs.ts
│   ├── follow-ups.ts
│   ├── dates.ts
│   ├── actions.ts
│   └── validations.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── public/
│
├── types/
│   └── index.ts
│
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── ...
```

The exact structure may vary slightly depending on the existing project, but responsibilities should remain separated.

---

# 25. Business Logic Layer

Business logic should not be duplicated inside UI components.

Important reusable functions should include:

```text
getFollowUpState()
getRecommendedAction()
getAttentionJobs()
getPipelineCounts()
getUpcomingFollowUps()
```

For example:

```text
getFollowUpState(job)
        ↓
OVERDUE
DUE_TODAY
UPCOMING
COMPLETED
```

This keeps dashboard, job details, and job lists consistent.

---

# 26. UX Principles

## Principle 1 — Action Over Information

The dashboard should prioritize:

> "What should I do?"

rather than:

> "How much data can I display?"

## Principle 2 — Five-Second Understanding

Denise should understand the state of her business within approximately five seconds of opening the application.

## Principle 3 — Minimal Clicks

Frequent actions should require as few clicks as practical.

## Principle 4 — Plain Language

Use business language rather than technical terminology.

## Principle 5 — Status Should Be Obvious

The current state of a job should always be visually clear.

## Principle 6 — No Feature Bloat

Only build functionality connected to the customer's stated pain.

---

# 27. Visual Design Direction

The visual system should communicate:

- Trust
- Simplicity
- Operational clarity
- Professionalism

Avoid:

- Excessive gradients
- Large decorative graphics
- Unnecessary animations
- Overloaded dashboards
- Excessive charts
- Marketing-style hero sections

The interface should feel like a focused B2B SaaS tool.

---

# 28. Responsive Design

The application should support:

### Desktop

Primary target.

### Tablet

Dashboard and job list remain usable.

### Mobile

The application remains functional for:

- Checking follow-ups
- Viewing job details
- Calling customers
- Updating status
- Setting follow-ups

The dashboard is the highest-priority responsive experience.

---

# 29. Error Handling

The application should never expose raw technical errors to the user.

Bad:

```text
PrismaClientKnownRequestError
```

Good:

```text
Couldn't update this job.
Please try again.
```

Handle:

- Database errors
- Validation errors
- Failed mutations
- Missing records
- Invalid routes

---

# 30. Loading States

Loading states should exist for:

- Job retrieval
- Job creation
- Job editing
- Status updates
- Follow-up updates
- Contact actions
- Deletion

The interface should always communicate whether an action is being processed.

---

# 31. Empty States

Important empty states include:

### No Jobs

> No jobs yet. Add your first job to start tracking follow-ups.

### No Follow-ups Today

> You're all caught up.

### No Search Results

> No jobs match your search.

### No Overdue Jobs

> No overdue follow-ups.

Empty states should be informative rather than blank.

---

# 32. Seed Data

The development environment should contain approximately 12–15 realistic jobs.

The seed dataset should demonstrate:

- New jobs
- Waiting on quote
- Waiting on customer
- Overdue follow-ups
- Due-today follow-ups
- Upcoming follow-ups
- Scheduled jobs
- Completed jobs

Example:

```text
ABC Restaurant
Freezer repair
Waiting on Customer
Overdue

FreshMart
Walk-in cooler
Waiting on Quote
Due Today

Central Warehouse
Ice machine
Scheduled
Upcoming

Burger House
Freezer repair
New
Due Today

Metro Grocery
Walk-in freezer
Done
```

---

# 33. Five-Phase Implementation Plan

The application will be implemented incrementally across five phases.

---

## Phase 1 — Foundation & Application Shell

### Objective

Create the project foundation and establish the application's visual architecture.

### Deliverables

- Next.js application
- TypeScript configuration
- Tailwind CSS
- shadcn/ui setup
- Prisma setup
- SQLite database
- Initial Job model
- Application layout
- Sidebar
- Navigation
- Today placeholder
- Jobs placeholder
- Add Job placeholder

### Outcome

A clean, runnable application shell.

```text
App Shell
   ↓
Navigation
   ↓
Today
Jobs
Add Job
   ↓
Database Foundation
```

### Phase 1 explicitly excludes

- Full CRUD
- Follow-up intelligence
- Activity history
- Advanced dashboard logic

---

# 34. Phase 2 — Job Management

### Objective

Turn the application into a functional job management system.

### Deliverables

- Create Job
- Read Jobs
- Edit Job
- Delete Job
- Job detail page
- Status management
- Search
- Status filtering
- Database persistence
- Seed data
- Empty states
- Validation

### Outcome

The system can now function as a centralized job database.

```text
Create
   ↓
Store
   ↓
View
   ↓
Edit
   ↓
Change Status
   ↓
Delete
```

However, the application does not yet fully solve the customer's core follow-up problem.

---

# 35. Phase 3 — Follow-up Intelligence

### Objective

Transform JobPulse from a CRUD application into an operational follow-up system.

### Deliverables

- Real Today dashboard
- Follow-ups Today
- Overdue detection
- Upcoming follow-ups
- Pipeline counts
- Recommended actions
- Attention prioritization
- Quick follow-up actions
- Mark Contacted
- Activity history
- Follow-up date updates

### Key logic

```text
Job
 ↓
Follow-up Date
 ↓
Follow-up State
 ├── Overdue
 ├── Due Today
 ├── Upcoming
 └── Completed
```

### Outcome

The dashboard now answers:

> **"Who do I need to call today?"**

---

# 36. Phase 4 — Workflow UX & Product Polish

### Objective

Make the application fast enough and intuitive enough to become a daily operational tool.

### Deliverables

- Inline status updates
- Quick follow-up workflow
- Quick contact workflow
- Phone call actions
- Improved Add Job experience
- URL-driven filters
- Improved empty states
- Loading states
- Error states
- Responsive design
- Accessibility improvements
- Keyboard interaction
- Visual consistency
- Improved microcopy

### Outcome

The application moves from:

> Functional prototype

to:

> Usable business product.

---

# 37. Phase 5 — Final QA & Submission Readiness

### Objective

Harden the application and prepare it for evaluation.

### Deliverables

- Full end-to-end testing
- Date/time validation
- Data integrity validation
- Responsive testing
- Accessibility audit
- Error handling audit
- Loading state audit
- Database migration verification
- Seed verification
- Build verification
- TypeScript verification
- Lint verification
- Removal of placeholder content
- README documentation
- Demo-flow validation
- Final UI polish

### Outcome

A stable, coherent, demonstrable hiring-assignment prototype.

---

# 38. Phase Dependency

The implementation must remain incremental.

```text
PHASE 1
Foundation
   │
   ▼
PHASE 2
Job Management
   │
   ▼
PHASE 3
Follow-up Intelligence
   │
   ▼
PHASE 4
Workflow UX
   │
   ▼
PHASE 5
QA + Submission
```

Each phase must leave the application in a runnable state.

No phase should depend on unfinished functionality from a later phase.

---

# 39. Testing Strategy

Testing should focus on real user workflows rather than isolated technical functionality.

## Critical Workflow

```text
Create Job
   ↓
Appears in Jobs
   ↓
Appears on Today
   ↓
Follow-up becomes due
   ↓
Contact Customer
   ↓
Create Activity
   ↓
Set Next Follow-up
   ↓
Change Status
   ↓
Schedule
   ↓
Done
```

## Critical Scenarios

### Scenario 1 — Overdue Job

Verify an overdue job appears under Needs Attention.

### Scenario 2 — Due Today

Verify today's follow-up is displayed correctly.

### Scenario 3 — Upcoming

Verify future follow-ups don't appear as overdue.

### Scenario 4 — Done

Verify completed jobs disappear from active attention.

### Scenario 5 — Status Change

Verify pipeline counts update.

### Scenario 6 — Contacted

Verify activity is created and next follow-up is updated.

### Scenario 7 — Delete

Verify the job and associated activity data are handled correctly.

---

# 40. Success Metrics

Because this is a prototype, success is primarily behavioral rather than quantitative.

The product succeeds if Denise can:

### Within 5 seconds

Understand:

- Whether she has overdue work
- Who needs attention today
- How many jobs are open
- Where jobs stand

### Within 30 seconds

Complete a follow-up workflow:

```text
Open Job
→ Contact
→ Record Note
→ Set Next Follow-up
```

### Within 1 minute

Create and track a new job.

---

# 41. MVP Acceptance Criteria

The prototype is considered complete when:

- [ ] Jobs can be created.
- [ ] Jobs persist in the database.
- [ ] Jobs can be edited.
- [ ] Jobs can be deleted.
- [ ] Jobs can change status.
- [ ] Jobs can be searched.
- [ ] Jobs can be filtered.
- [ ] Follow-up dates can be assigned.
- [ ] Overdue jobs are automatically detected.
- [ ] Due-today jobs are automatically detected.
- [ ] Upcoming jobs are visible.
- [ ] Completed jobs are excluded from active follow-ups.
- [ ] Dashboard pipeline counts are accurate.
- [ ] Recommended actions are displayed.
- [ ] Jobs can be marked contacted.
- [ ] Contact activity is recorded.
- [ ] Next follow-up can be scheduled.
- [ ] Responsive layout works.
- [ ] Loading states exist.
- [ ] Error states exist.
- [ ] Empty states exist.
- [ ] Database migrations work.
- [ ] Seed data works.
- [ ] Production build succeeds.
- [ ] README explains setup and product decisions.

---

# 42. Demo Narrative

The final demonstration should not be a feature tour.

It should tell the story of the customer's problem.

## Step 1 — Open Today

Show:

> "Good morning, Denise."

Immediately demonstrate overdue and due-today jobs.

## Step 2 — Open a Job

Show:

- Customer
- Job
- Status
- Follow-up
- Activity

## Step 3 — Follow Up

Click:

> Follow Up

Record the interaction.

Set the next follow-up.

## Step 4 — Update Status

Move the job from:

```text
Waiting on Customer
```

to:

```text
Scheduled
```

Show the dashboard updating.

## Step 5 — Complete Job

Move the job to:

```text
Done
```

Show that it disappears from active follow-ups.

## Closing Statement

The product demonstrates that Denise no longer needs to remember which customer she forgot to call.

JobPulse tells her.

---

# 43. Future Roadmap

These features may become relevant after the prototype:

### V2

- Email inbox ingestion
- Website form integration
- SMS integration
- Customer communication history
- Quote generation
- Automated reminders

### V3

- Technician scheduling
- Dispatch
- Route optimization
- Customer portal
- Invoicing
- Payments
- Business analytics

These features are intentionally excluded from the prototype because they do not directly solve the customer's immediate problem.

---

# 44. Key Product Decision

The central product decision is:

> **Build a follow-up operating system, not a full field-service management platform.**

The customer has a relatively small volume of jobs—approximately 15–20 new requests per week—and explicitly says the problem is that requests are scattered across multiple places.

Therefore, adding complexity would work against the product goal.

The product should optimize for:

```text
CLARITY
   +
FOLLOW-UP
   +
SPEED
```

rather than feature breadth.

---

# 45. Final Product Definition

JobPulse is a focused job and follow-up management application for small service businesses.

Its core experience is:

```text
                 JOBPULSE

       "What needs my attention?"
                  │
                  ▼
          ┌───────────────┐
          │ Needs Attention│
          └───────┬───────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
     OVERDUE            DUE TODAY
        │                   │
        └─────────┬─────────┘
                  ▼
             FOLLOW UP
                  │
                  ▼
           UPDATE ACTIVITY
                  │
                  ▼
          SET NEXT ACTION
                  │
                  ▼
             SCHEDULED
                  │
                  ▼
                DONE
```

The product's success is not measured by how many features it contains.

It is measured by whether Denise can open the application every morning and immediately know:

> **Who do I need to call today, and where is every job?**

That is the product.