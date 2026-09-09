# Weekly Report Generator & Team Dashboard

## Full Assignment Requirements & Implementation Instructions

**Selected Stack**

* **Frontend:** Next.js + TypeScript
* **Backend:** NestJS + TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **UI:** Tailwind CSS + shadcn/ui
* **Charts:** Recharts
* **API:** REST API

> **Important:** The following document is based on the requirements in the provided Technical Assignment PDF. Where I add implementation recommendations for your chosen stack, I label them as recommendations rather than assignment requirements.

---

# 1. Assignment Overview

## Assignment Title

**Weekly Report Generator & Team Dashboard**

## Main Objective

Build a full-stack web application that allows:

1. Individual team members to submit structured weekly work reports.
2. Managers to review those reports.
3. Managers to send reports back for correction.
4. Team members to correct and resubmit reports.
5. Managers to approve reports.
6. Managers to view and analyze reports across the entire team through a dashboard.

The assignment evaluates:

* Multi-user system design
* Role-based access control
* Review/approval workflow
* Clean UI components
* Backend architecture
* Data management
* Optional AI-assisted functionality

The assignment prefers modern frontend frameworks such as React and Next.js. 

---

# 2. Technology Stack

## 2.1 Frontend

You will use:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
React Hook Form
Zod
Recharts
```

The assignment's preferred frontend frameworks include React and Next.js. 

---

## 2.2 Backend

You will use:

```text
NestJS
TypeScript
REST API
JWT Authentication
Role-Based Access Control
Prisma ORM
```

The assignment lists Node.js with Express or NestJS among its preferred backend technologies. 

---

## 2.3 Database

Recommended:

```text
PostgreSQL
```

The assignment allows:

* PostgreSQL
* MySQL
* MongoDB



---

# 3. Recommended Project Architecture

Use a **single GitHub repository** containing separate frontend and backend applications.

```text
weekly-report-system/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── hooks/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── reports/
│   │   ├── projects/
│   │   ├── dashboard/
│   │   └── ...
│   └── prisma/
│
├── docs/
│   └── er-diagram.png
│
├── README.md
└── .gitignore
```

### Why this structure?

The assignment requires the GitHub repository to contain:

* Frontend code
* Backend code
* Setup instructions

It does **not** require separate Git repositories. 

---

# 4. User Authentication & Roles

The application must support authentication with role-based access.

## Required roles

### Team Member

Can:

* Create own weekly reports
* Edit own reports
* Submit own reports
* View own report history
* Correct reports returned by manager
* Resubmit corrected reports

### Manager / Admin

Can:

* View team reports
* Analyze reports
* Review submitted reports
* Approve reports
* Request corrections



---

# 5. Authentication Requirements

Implement:

```text
Registration
Login
Logout
Password protection
Secure session handling
Role assignment
```

Recommended implementation:

```text
Next.js
    ↓
POST /api/auth/login
    ↓
NestJS
    ↓
Validate credentials
    ↓
JWT
    ↓
Authenticated user
```

For authorization:

```text
TEAM_MEMBER
MANAGER
ADMIN
```

> The assignment explicitly requires Team Member and Manager/Admin roles. Whether you split Manager and Admin into two separate roles is an implementation decision.

---

# 6. Weekly Report System

Every team member needs a dedicated page for creating and managing weekly reports.

The report structure must be **fixed and identical for everyone**.

Users must **not** be able to:

* Add custom fields
* Remove fields
* Reorder fields
* Customize the report structure

This ensures that reports are consistent and comparable. 

---

# 7. Weekly Report Fields

Each report must contain the following.

## 7.1 Week / Date Range

Example:

```text
Week Start: 2026-09-01
Week End:   2026-09-07
```

---

## 7.2 Project / Category

Example:

```text
Project:
[ E-Commerce System ]
```

Projects/categories can include:

```text
Client A
Internal Tooling
R&D
Marketing
```



---

# 8. Completed Tasks

Use a task-level table.

Recommended UI:

| Task Name | Priority | Planned % | Actual % | Status      | Planned Time | Spent Time | Deliverable  |
| --------- | -------- | --------: | -------: | ----------- | -----------: | ---------: | ------------ |
| Login API | High     |      100% |     100% | Completed   |           6h |         5h | Auth API     |
| Dashboard | High     |      100% |      80% | In Progress |          10h |        12h | Dashboard UI |

Required task information:

* Task name
* Priority
* Planned percentage
* Actual percentage
* Status
* Planned time
* Spent time
* Output/deliverable



---

# 9. Tasks Planned for Next Week

Provide a section where the team member can describe upcoming work.

Example:

```text
Next Week Tasks

1. Complete dashboard charts
2. Implement notification system
3. Write automated tests
4. Deploy staging environment
```

---

# 10. Blockers / Challenges

Team members should be able to record problems encountered during the week.

Example:

```text
Blockers:

- Payment API documentation incomplete
- Staging server unavailable
- Client approval delayed
```

One blocker can be marked as:

```text
⭐ Key Issue
```

The assignment explicitly requires the ability to flag one blocker as the key issue. 

---

# 11. Achievements / Highlights

Team members can record achievements.

Example:

```text
Achievements:

- Completed authentication system
- Reduced API response time
- Finished dashboard design
```

One can be marked:

```text
⭐ Key Achievement
```

---

# 12. Hours Worked

This section is optional according to the assignment.

Possible categories:

```text
Development
Testing
Meetings
Documentation
```

Example:

| Task Type     | Hours |
| ------------- | ----: |
| Development   |    25 |
| Testing       |     8 |
| Meetings      |     4 |
| Documentation |     3 |



---

# 13. Notes / Links

Optional:

```text
Notes:
Completed authentication module.

Links:
GitHub PR
Figma design
Documentation
```

---

# 14. Report Actions

The user must be able to:

### Save Draft

```text
Save Draft
```

The report remains editable.

### Submit

```text
Submit for Review
```

The report moves to:

```text
SUBMITTED
```

### Edit

Allowed when:

```text
DRAFT
NEEDS_CORRECTION
```

### Resubmit

After correction:

```text
NEEDS_CORRECTION
        ↓
Edit
        ↓
Resubmit
        ↓
SUBMITTED
```

The assignment explicitly requires this workflow. 

---

# 15. Report Status Workflow

This is one of the **most important requirements**.

```text
                 ┌──────────────┐
                 │    DRAFT     │
                 └──────┬───────┘
                        │
                     Submit
                        │
                        ▼
                 ┌──────────────┐
                 │  SUBMITTED   │
                 └──────┬───────┘
                        │
                  Manager Review
                   ┌────┴─────┐
                   │          │
                Approve    Request Changes
                   │          │
                   ▼          ▼
             ┌──────────┐ ┌──────────────────┐
             │ APPROVED │ │ NEEDS_CORRECTION │
             └──────────┘ └────────┬─────────┘
                                   │
                                  Edit
                                   │
                                Resubmit
                                   │
                                   ▼
                              SUBMITTED
```

The required statuses are:

```text
Draft
Submitted
Needs Correction
Approved
```



---

# 16. Manager Review

A manager opening a submitted report has two main actions:

```text
Approve
Request Changes
```

If approving:

```text
SUBMITTED → APPROVED
```

If requesting changes:

```text
SUBMITTED → NEEDS_CORRECTION
```

The manager must provide a general comment when requesting changes.

Example:

> Please update the actual completion percentages and provide the missing deliverable links.



---

# 17. Permissions

## Team Member

Must only access:

```text
Own reports
```

Cannot:

```text
View another member's report
Edit another member's report
Approve reports
Request corrections
```

## Manager

Can:

```text
View all reports
Review reports
Approve reports
Request changes
```

But cannot rewrite the actual report content.

Managers should only modify:

```text
status
review/comment information
```



---

# 18. Report Version History

This is listed as a **bonus**, but it is worth implementing.

Example:

```text
Report: Week 36

Version 1
Submitted: Sep 1
Status: Needs Correction

Version 2
Submitted: Sep 3
Status: Submitted

Version 3
Submitted: Sep 4
Status: Approved
```

The previous report content must remain available rather than being overwritten.

A manager should be able to view:

```text
Previous Version
Current Version
Submission timestamp
Related comment
```



---

# 19. Team Dashboard

Manager dashboard needs to show reports across the team.

Required capabilities:

* Select week
* Filter by team member
* Filter by project/category
* Filter by date
* Track submission status
* Open report
* Review report



---

# 20. Dashboard Status Tracking

Show something like:

| Member | Status           |
| ------ | ---------------- |
| Akila  | Approved         |
| Kasun  | Submitted        |
| Nimal  | Needs Correction |
| Amal   | Draft            |
| Ravi   | Not Started      |

The assignment specifically includes:

```text
Draft
Submitted
Needs Correction
Approved
Not Yet Started
```



---

# 21. Dashboard Metrics

Required summary metrics include:

### Total Reports Submitted This Week

Example:

```text
32
```

### Submission Compliance Rate

Example:

```text
86%
```

### Needs Correction

```text
4 Reports
```

### Open Blockers

```text
7
```

The assignment requires these summary metrics. 

---

# 22. Dashboard Charts

Implement charts for:

## Tasks Completed Trend

```text
Week 1 → 20
Week 2 → 28
Week 3 → 34
Week 4 → 31
```

## Report Status by Team Member

Bar/chart representation.

## Workload by Project

Example:

```text
Project A       45%
Project B       30%
Internal        15%
R&D             10%
```

## Time by Task Type

Example:

```text
Development     60%
Testing         20%
Meetings        10%
Documentation   10%
```

## Recent Activity

Example:

```text
✓ Kasun's report approved
↻ Nimal resubmitted report
! Amal's report sent for correction
```

These visual insights are required in the dashboard. 

---

# 23. Recommended Dashboard Layout

```text
┌──────────────────────────────────────────────────┐
│ Dashboard                                        │
├──────────┬──────────┬──────────┬────────────────┤
│ Submitted│ Compliance│Correction│ Open Blockers │
│    32    │    86%    │     4    │       7       │
└──────────┴──────────┴──────────┴────────────────┘

┌──────────────────────┐ ┌────────────────────────┐
│ Task Completion      │ │ Report Status          │
│ Trend                │ │ by Member              │
│                      │ │                        │
└──────────────────────┘ └────────────────────────┘

┌──────────────────────┐ ┌────────────────────────┐
│ Workload by Project  │ │ Time by Task Type      │
│                      │ │                        │
└──────────────────────┘ └────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Recent Activity                                  │
├──────────────────────────────────────────────────┤
│ ✓ Report approved                                │
│ ! Correction requested                           │
│ ↻ Report resubmitted                             │
└──────────────────────────────────────────────────┘
```

---

# 24. Projects / Categories

Create a proper management page.

Required operations:

```text
Create
Read
Update
Delete
```

Example:

```text
Projects

+ Add Project

Client A
Internal Tooling
R&D
Marketing
```

Assigning team members to projects is optional. 

---

# 25. Required Pages / Views

The assignment requires at least **7** pages/views from its list.

Recommended implementation: build **10 pages**.

## 1. Login

```text
/login
```

## 2. Register

```text
/register
```

## 3. Personal Weekly Report

```text
/reports/new
/reports/[id]/edit
```

## 4. Report History

```text
/reports/history
```

Shows:

```text
Week
Project
Status
Submitted date
Actions
```

## 5. Report Detail

```text
/reports/[id]
```

Read-only report view.

## 6. Team Dashboard

```text
/dashboard
```

Manager view.

## 7. Manager Review

```text
/manager/reports/[id]/review
```

Actions:

```text
Approve
Request Changes
```

## 8. Team Member Profile

```text
/manager/users/[id]
```

Shows:

* Member information
* Report history
* Basic statistics

## 9. Project Management

```text
/manager/projects
```

CRUD.

## 10. User Management

```text
/admin/users
```

Admin can:

* Invite users
* Remove users
* Assign roles

The assignment lists these page/view types and states that submissions with only two or three basic screens are incomplete. 

---

# 26. Suggested Next.js Route Structure

```text
frontend/
└── app/
    ├── (auth)/
    │   ├── login/
    │   └── register/
    │
    ├── (member)/
    │   ├── dashboard/
    │   ├── reports/
    │   │   ├── new/
    │   │   ├── history/
    │   │   └── [id]/
    │   │
    │   └── profile/
    │
    ├── (manager)/
    │   ├── dashboard/
    │   ├── reports/
    │   │   └── [id]/
    │   │       └── review/
    │   ├── users/
    │   │   └── [id]/
    │   └── projects/
    │
    └── (admin)/
        └── users/
```

---

# 27. NestJS Backend Structure

Recommended:

```text
backend/
└── src/
    │
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.module.ts
    │   ├── guards/
    │   └── strategies/
    │
    ├── users/
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   └── users.module.ts
    │
    ├── roles/
    │
    ├── reports/
    │   ├── reports.controller.ts
    │   ├── reports.service.ts
    │   ├── reports.module.ts
    │   └── dto/
    │
    ├── report-tasks/
    │
    ├── report-versions/
    │
    ├── review-comments/
    │
    ├── projects/
    │
    ├── dashboard/
    │
    └── common/
        ├── guards/
        ├── decorators/
        ├── filters/
        └── interceptors/
```

This structure fits the assignment's requirement for clean controller/service organization. 

---

# 28. REST API

The backend must provide a REST API.

Recommended endpoints:

## Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

## Users

```text
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

## Projects

```text
GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
```

## Reports

```text
GET    /reports
POST   /reports
GET    /reports/:id
PATCH  /reports/:id
POST   /reports/:id/submit
POST   /reports/:id/resubmit
```

## Manager Review

```text
POST /reports/:id/approve
POST /reports/:id/request-correction
```

## Dashboard

```text
GET /dashboard/summary
GET /dashboard/task-trends
GET /dashboard/status
GET /dashboard/workload
GET /dashboard/time-distribution
GET /dashboard/activity
```

These are **recommended endpoint designs**, not endpoint names explicitly prescribed by the PDF.

---

# 29. Request Validation

Backend validation is required.

For example:

```text
POST /reports
```

should validate:

```text
week_start
week_end
project_id
tasks
blockers
achievements
```

NestJS DTOs + `class-validator` are a good implementation choice.

Frontend can additionally use:

```text
React Hook Form
+
Zod
```

The assignment requires proper request validation and basic client-side validation. 

---

# 30. Pagination & Filtering

Any API returning a list of reports should support pagination and/or filtering.

Example:

```text
GET /reports?page=1&limit=20
```

Filtering:

```text
GET /reports?
    status=SUBMITTED
    &projectId=3
    &userId=10
    &weekStart=2026-09-01
```

The assignment explicitly requires pagination and/or filtering on report-list endpoints. 

---

# 31. Database Design

Recommended entities:

```text
roles
users
projects
reports
report_tasks
report_blockers
report_achievements
report_hours
report_versions
review_comments
```

---

# 32. Entity Relationships

Recommended:

```text
roles
  │
  │ 1:N
  ▼
users
  │
  │ 1:N
  ▼
reports
  │
  ├──── 1:N ──── report_tasks
  │
  ├──── 1:N ──── report_blockers
  │
  ├──── 1:N ──── report_achievements
  │
  ├──── 1:N ──── report_hours
  │
  └──── 1:N ──── report_versions
                       │
                       │ 1:N
                       ▼
                review_comments

projects
   │
   │ 1:N
   ▼
reports
```

---

# 33. Core Tables

## roles

```text
id
name
```

Example:

```text
TEAM_MEMBER
MANAGER
ADMIN
```

---

## users

```text
id
role_id
name
email
password_hash
created_at
updated_at
```

Relationship:

```text
Role 1 ──── N Users
```

---

## projects

```text
id
name
description
created_at
updated_at
```

---

## reports

```text
id
user_id
project_id
week_start
week_end
status
latest_review_comment
submitted_at
approved_at
created_at
updated_at
```

---

## report_tasks

```text
id
report_id
task_name
priority
planned_percent
actual_percent
status
planned_hours
spent_hours
deliverable
```

---

## report_blockers

```text
id
report_id
description
is_key_issue
```

---

## report_achievements

```text
id
report_id
description
is_key_achievement
```

---

## report_hours

```text
id
report_id
task_type
hours
```

---

## report_versions

Recommended for the bonus version-history feature:

```text
id
report_id
version_number
submitted_by
submitted_at
```

You would also need to preserve the report content associated with each version.

---

## review_comments

```text
id
report_id
version_id
reviewer_id
comment
action
created_at
```

Possible actions:

```text
REQUEST_CHANGES
APPROVED
```

---

# 34. ER Diagram Deliverable

You must submit an ER Diagram showing relationships between:

* Users
* Roles
* Projects
* Reports
* Report status/review history



Recommended tool:

**draw.io / diagrams.net**

Export:

```text
ER-Diagram.png
```

Put it inside:

```text
docs/er-diagram/
```

And also submit it to the required Google Drive folder.

---

# 35. Seed Data

You should seed:

```text
3–5 Team Members
Several weeks of reports
Different statuses
Multiple projects
Tasks
Blockers
Achievements
Review history
```

Example:

```text
Akila
 ├── Week 1 → Approved
 ├── Week 2 → Approved
 └── Week 3 → Submitted

Kasun
 ├── Week 1 → Approved
 ├── Week 2 → Needs Correction
 └── Week 3 → Submitted

Nimal
 ├── Week 1 → Draft
 └── Week 2 → Approved
```

The assignment explicitly asks for seeded data with at least 3–5 team members and several weeks of reports in different statuses. 

---

# 36. Automated Testing

At least one RBAC test is strongly recommended.

Example:

```text
Team Member A
      ↓
tries to access
      ↓
Team Member B's Report
      ↓
403 Forbidden
```

Another useful test:

```text
Team Member
      ↓
tries to approve report
      ↓
403 Forbidden
```

The assignment calls an automated RBAC test a bonus and strongly recommends it. 

---

# 37. AI Chat Assistant

This is **Good to Have**, not mandatory.

Possible implementation:

```text
Manager
   ↓
AI Chat
   ↓
NestJS
   ↓
Reports Database
   ↓
AI Model
   ↓
Answer
```

Example questions:

```text
"What did the team work on last week?"

"What were the most common blockers?"

"Which project received the most development time?"

"Summarize this week's team activity."
```

Possible AI capabilities:

* Conversational Q&A
* Team summary
* Recurring blocker detection
* Workload imbalance identification



If implemented, document:

* AI approach
* Prompt design
* Data privacy considerations

---

# 38. Responsive UI

Frontend must be responsive.

Test at:

```text
Desktop
Laptop
Tablet
Mobile
```

Use reusable components:

```text
Button
Input
Select
Modal
DataTable
StatusBadge
Card
Chart
Sidebar
Navbar
```

The assignment explicitly expects responsive layout, component-based structure, reusable components and clear frontend organization. 

---

# 39. UI Architecture

Recommended:

```text
components/
│
├── ui/
│   ├── Button
│   ├── Input
│   ├── Dialog
│   └── Select
│
├── reports/
│   ├── ReportForm
│   ├── TaskTable
│   ├── BlockerList
│   ├── AchievementList
│   └── ReportStatusBadge
│
├── dashboard/
│   ├── MetricCard
│   ├── TaskTrendChart
│   ├── StatusChart
│   ├── WorkloadChart
│   └── ActivityFeed
│
└── layout/
    ├── Sidebar
    └── Header
```

---

# 40. Submission Deliverables

You must prepare:

## 1. Technical Presentation

The presentation should explain:

* System architecture
* Database design
* Frontend components
* Personal report page
* Report history
* Team dashboard
* API design
* RBAC
* Review workflow
* AI approach if implemented
* Challenges
* Future improvements



---

# 41. GitHub Repository

The repository needs:

```text
Frontend
Backend
README.md
```

README should explain:

### Installation

```text
npm install
```

### Frontend

```text
cd frontend
npm run dev
```

### Backend

```text
cd backend
npm run start:dev
```

### Database

Explain:

```text
PostgreSQL setup
Environment variables
Prisma migration
Seed
```

The assignment explicitly requires setup instructions for dependencies, frontend, backend and database. 

---

# 42. Environment Variables

Do **not** commit secrets.

Frontend:

```text
NEXT_PUBLIC_API_URL=
```

Backend:

```text
DATABASE_URL=
JWT_SECRET=
```

If AI is implemented:

```text
AI_API_KEY=
```

Use:

```text
.env
.env.example
```

Commit:

```text
.env.example
```

Never commit:

```text
.env
```

---

# 43. Demo Video

The demo should show:

### Team Member

```text
Login
 ↓
Create report
 ↓
Save draft
 ↓
Submit
```

### Manager

```text
Login
 ↓
Dashboard
 ↓
Open report
 ↓
Request correction
 ↓
Add comment
```

### Team Member

```text
See correction
 ↓
Edit report
 ↓
Resubmit
```

### Manager

```text
Review again
 ↓
Approve
```

Also demonstrate reports belonging to **2–3 different team members**.

The assignment asks for the camera to be turned on with the presenter's face visible. 

---

# 44. Deployment

Deployment is a bonus/favorable factor.

Recommended architecture:

```text
                    Internet
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        Next.js App          NestJS API
          Vercel                VPS
                                │
                                ▼
                           PostgreSQL
```

A local-only submission is accepted, but a deployed application is viewed favorably. 

---

# 45. Evaluation Criteria

Your application will be evaluated on:

```text
System Design
Code Quality
UI Structure
UI Completeness
Component Reusability
API Design
RBAC
Database Design
Review Workflow
Documentation
Technical Presentation
Understanding of Codebase
```

AI implementation can provide bonus points. 

---

# 46. Live Coding Round

This is very important.

AI tools are allowed during development.

However, shortlisted candidates can be asked to:

* Explain their code
* Make changes in real time
* Add a feature
* Modify existing functionality

Therefore, you must understand your own:

```text
Next.js
NestJS
TypeScript
Prisma
PostgreSQL
Authentication
RBAC
REST API
Database relationships
Report workflow
```

The assignment explicitly states that the live coding round is intended to verify genuine understanding of the submitted codebase. 

---

# 47. Recommended Development Order

Don't start by building the dashboard.

Follow this order:

## Phase 1 — Project Setup

```text
Create GitHub repository
        ↓
Create Next.js frontend
        ↓
Create NestJS backend
        ↓
Setup PostgreSQL
        ↓
Setup Prisma
```

---

## Phase 2 — Database

Create:

```text
roles
users
projects
reports
report_tasks
report_blockers
report_achievements
report_hours
report_versions
review_comments
```

Then create:

```text
Prisma migrations
Seed data
```

---

## Phase 3 — Authentication

Implement:

```text
Register
Login
Logout
Current user
Password hashing
JWT
```

---

## Phase 4 — RBAC

Implement:

```text
TEAM_MEMBER
MANAGER
ADMIN
```

And backend guards.

---

## Phase 5 — Report CRUD

Implement:

```text
Create report
Save draft
Edit draft
View report
Report history
```

---

## Phase 6 — Tasks / Blockers / Achievements

Implement:

```text
Tasks
Blockers
Key Issue
Achievements
Key Achievement
Hours
Notes
Links
```

---

## Phase 7 — Submission Workflow

Implement:

```text
Draft
 ↓
Submitted
 ↓
Needs Correction
 ↓
Submitted
 ↓
Approved
```

This should be tested carefully.

---

## Phase 8 — Version History

Implement:

```text
Version 1
Version 2
Version 3
```

and review comments.

---

## Phase 9 — Manager Dashboard

Build:

```text
Summary cards
Filters
Report table
Status
Charts
Activity feed
```

---

## Phase 10 — Additional Pages

Complete at least 7.

I recommend all 10.

---

## Phase 11 — Testing

At minimum:

```text
RBAC
Report ownership
Workflow
```

---

## Phase 12 — Seed Data

Create realistic data.

---

## Phase 13 — Deployment

Deploy if possible.

---

## Phase 14 — Presentation + Demo

Prepare:

```text
Presentation
ER Diagram
Demo Video
GitHub README
```

---

# 48. Final Project Checklist

Before submitting, verify:

### Authentication

* [ ] Register
* [ ] Login
* [ ] Logout
* [ ] Password hashing
* [ ] Secure authentication
* [ ] Role assignment

### Team Member

* [ ] Create report
* [ ] Save draft
* [ ] Edit report
* [ ] Submit report
* [ ] View history
* [ ] See correction comment
* [ ] Correct report
* [ ] Resubmit

### Manager

* [ ] View all reports
* [ ] Filter reports
* [ ] Open report
* [ ] Approve
* [ ] Request correction
* [ ] Add comment

### Reports

* [ ] Week/date range
* [ ] Project/category
* [ ] Tasks
* [ ] Priority
* [ ] Planned %
* [ ] Actual %
* [ ] Status
* [ ] Planned time
* [ ] Spent time
* [ ] Deliverable
* [ ] Next-week tasks
* [ ] Blockers
* [ ] Key blocker
* [ ] Achievements
* [ ] Key achievement
* [ ] Hours
* [ ] Notes/links

### Dashboard

* [ ] Submitted count
* [ ] Compliance rate
* [ ] Needs correction count
* [ ] Open blockers
* [ ] Task trend
* [ ] Member status
* [ ] Project workload
* [ ] Task-type time
* [ ] Activity feed

### Pages

* [ ] Login
* [ ] Register
* [ ] Personal report
* [ ] Report history
* [ ] Report detail
* [ ] Team dashboard
* [ ] Manager review
* [ ] Team member profile
* [ ] Project management
* [ ] User management

### Technical

* [ ] REST API
* [ ] Request validation
* [ ] RBAC
* [ ] Pagination/filtering
* [ ] Clean controllers/services
* [ ] PostgreSQL
* [ ] Prisma
* [ ] Seed data
* [ ] Automated RBAC test

### Deliverables

* [ ] GitHub repository
* [ ] README
* [ ] ER Diagram
* [ ] Presentation
* [ ] Demo video
* [ ] Google Drive folder
* [ ] Correct sharing permissions

The submission folder must contain the presentation, ER diagram and demo video, with sharing enabled, and the submission email must include the GitHub repository link and Google Drive folder link. 

---

# 49. Recommended Final Architecture

For **your chosen stack**, I would use this:

```text
                    ┌───────────────────────┐
                    │       Next.js         │
                    │     TypeScript        │
                    │                       │
                    │ Tailwind + shadcn/ui  │
                    │ React Hook Form + Zod │
                    │ Recharts              │
                    └───────────┬───────────┘
                                │
                             REST API
                                │
                                ▼
                    ┌───────────────────────┐
                    │        NestJS         │
                    │      TypeScript       │
                    │                       │
                    │ Auth                   │
                    │ RBAC                   │
                    │ Reports                │
                    │ Projects               │
                    │ Dashboard              │
                    │ Review Workflow        │
                    └───────────┬───────────┘
                                │
                              Prisma
                                │
                                ▼
                    ┌───────────────────────┐
                    │      PostgreSQL       │
                    │                       │
                    │ Users                 │
                    │ Roles                 │
                    │ Projects              │
                    │ Reports               │
                    │ Tasks                 │
                    │ Versions              │
                    │ Reviews               │
                    └───────────────────────┘
```

## ⭐ Priority

If you have limited time, prioritize in this order:

```text
1. Authentication + RBAC
2. Database + ER Diagram
3. Report CRUD
4. Submit → Correction → Resubmit → Approve workflow
5. Manager Dashboard
6. Required 7+ pages
7. Seed data
8. Tests
9. Version history
10. AI Assistant
11. Deployment
```

**Do not start with AI.** The core report workflow and RBAC are much more important for this assignment.

This gives you a solid implementation roadmap while staying aligned with the actual PDF requirements.
