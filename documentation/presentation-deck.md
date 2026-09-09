# Technical Presentation: Weekly Report Generator & Team Dashboard

This document provides the complete slide-by-slide content, speaker notes, and architectural talking points for your Google Slides presentation as required by the Technical SE Assignment.

---

## Slide 1: Title Slide
- **Title:** Weekly Report Generator & Team Dashboard
- **Subtitle:** Multi-User Engineering Status Tracking, Review Workflows & Executive Analytics
- **Presenter:** Akila Madhushanka
- **Role:** Technical Software Engineer
- **Tech Stack:** Next.js 14, NestJS 10, PostgreSQL, Prisma ORM, Tailwind CSS, Recharts

> **Speaker Notes:**
> "Good morning/afternoon everyone. Today I'm excited to present the Weekly Report Generator & Team Dashboard — a full-stack platform designed to eliminate asynchronous communication silos, enforce report consistency across engineering squads, and provide managers with instant visibility into sprint velocity, roadblocks, and delivery compliance."

---

## Slide 2: Problem Statement & Objectives
- **The Challenge:**
  - Inconsistent, ad-hoc weekly reporting formats across team members.
  - Lack of an auditable correction/feedback loop when deliverables are missing or progress percentages are unclear.
  - Absence of consolidated manager analytics to identify recurring blockers and workload imbalances.
- **Our Solution:**
  - Standardized, fixed-structure reporting for every team member.
  - Explicit multi-role review state machine (`DRAFT` &rarr; `SUBMITTED` &rarr; `NEEDS_CORRECTION` &rarr; `APPROVED`).
  - Immutable version snapshots preserving every revision cycle.
  - Executive data-driven dashboard with real-time charting and AI-assisted insights.

---

## Slide 3: High-Level System Architecture
- **Frontend Layer (Next.js 14 App Router):**
  - Modern TypeScript single-page application with responsive Tailwind CSS & custom design system.
  - Client-side validation, interactive task tables, and Recharts data visualizations.
- **Backend API Layer (NestJS 10 REST API):**
  - Modular enterprise architecture (Auth, Users, Projects, Reports, Reviews, Dashboard, AI).
  - Passport Bearer JWT Authentication with custom RBAC guards.
  - DTO validation pipes using `class-validator`.
- **Persistence Layer (PostgreSQL + Prisma ORM):**
  - Fully normalized relational schema with foreign key constraints, indexes, and JSONB audit snapshots.

---

## Slide 4: Database Design & Entity Relationships
*(Include graphic from `diagram/er-diagram.svg`)*
- **11 Normalized Entities:**
  - `roles` & `users`: Hierarchical RBAC (`TEAM_MEMBER`, `MANAGER`, `ADMIN`).
  - `projects`: Configurable work initiatives and category tags with color coding.
  - `reports`: Central aggregate root linked to weekly timeframe (`week_start` & `week_end`).
  - `report_tasks`: Granular task breakdown with planned vs actual %, planned vs spent hours, and deliverables.
  - `report_blockers`: Challenges with boolean `is_key_issue` flag (strictly 1 key issue per week).
  - `report_achievements`: Milestone highlights with `is_key_achievement` flag.
  - `report_hours`: Categorized time allocation (Development, Testing, Meetings, etc.).
  - `report_versions`: Immutable audit snapshots captured upon submission/resubmission.
  - `review_comments`: Manager feedback and actionable change requests.

---

## Slide 5: Role-Based Access Control (RBAC) & Security
- **Horizontal Data Isolation:**
  - Team members can only view, create, and modify their own reports.
  - Attempting to inspect or alter another member's report returns an HTTP `403 Forbidden`.
- **Vertical Privilege Escalation Prevention:**
  - Only users with `MANAGER` or `ADMIN` roles can approve reports, request corrections, or access executive dashboard analytics.
  - Automated e2e test suite (`backend/test/rbac.e2e-spec.ts`) validates both horizontal and vertical isolation.
- **Security Best Practices:**
  - Passwords hashed with `bcrypt` (10 rounds).
  - Stateless JWT tokens signed with secure server secrets and expiration windows.

---

## Slide 6: Report Review & Correction State Machine
- **The Core Review Lifecycle:**
  1. `DRAFT`: Private to team member; continuous editing.
  2. `SUBMITTED`: Report frozen; visible on Manager Dashboard; Version 1 snapshot archived.
  3. `NEEDS_CORRECTION`: Manager sends report back with required general feedback comment. A prominent alert banner appears on the member's edit screen.
  4. `RESUBMITTED`: Member updates missing deliverables and resubmits; moves back to `SUBMITTED` with Version 2 snapshot.
  5. `APPROVED`: Manager verifies changes and signs off; approval timestamp recorded.

---

## Slide 7: Version History & Audit Trail (Bonus Feature)
- **Immutable Snapshots:**
  - Rather than overwriting past content during a correction cycle, each submission creates an immutable JSONB snapshot in `report_versions`.
- **Side-by-Side Version Inspector:**
  - Reviewers can toggle between Version 1, Version 2, and the current submission to verify exactly what was corrected.
  - Review comments are linked directly to the specific version they were issued against.

---

## Slide 8: Executive Team Dashboard & Visual Insights
- **Key Metrics (Top Cards):**
  - Total Submitted vs Total Team Members.
  - Team Submission Compliance Rate (%).
  - Reports in Needs Correction status.
  - Open team blockers.
- **Visual Charts (Recharts):**
  - **Task Completion Trend:** Sprint velocity over the past 5 weeks.
  - **Workload Distribution:** Cumulative hours by project category.
  - **Time Allocation:** Breakdown by task type (Dev, Test, Meetings).
  - **Member Status Table:** Real-time tracking of who has submitted or needs reminders.
  - **Side-by-Side Section Modal:** Bonus tool allowing managers to compare all team blockers or achievements across members in one view.

---

## Slide 9: AI Chat Assistant (Good-to-Have Feature)
- **Architecture & Approach:**
  - Built-in floating chat widget powered by a lightweight RAG (Retrieval Augmented Generation) pipeline over PostgreSQL report records.
- **Capabilities:**
  - Answers natural language questions: *"What are the key blockers this week?"*, *"Summarize this week's team activity"*, *"Which project received the most development hours?"*.
- **Data Privacy:**
  - Queries execute against localized team context; sensitive internal data is not transmitted to public untrusted models.

---

## Slide 10: Engineering Challenges & Solutions
1. **Handling Windows Pathing & Shell Quirks:**
   - Addressed directory names with spaces and ampersands using resilient Node script runners.
2. **Strict 1-Key Blocker / Win Invariant:**
   - Enforced at both frontend state layer and backend service layer via transaction-safe normalizers.
3. **Database Portability:**
   - Prisma schema engineered for PostgreSQL with robust seeding across 4 calendar weeks.

---

## Slide 11: Future Enhancements
- **Email & Slack Webhook Notifications:** Automated alerts when reports are submitted or sent for correction.
- **Calendar & Jira Integration:** Auto-import tasks and pull request links directly from GitHub and Jira.
- **Automated PDF Export:** One-click executive PDF generator for board and stakeholder distribution.

---

## Slide 12: Q&A & Live Demonstration
- Open for questions and live walkthrough.
- Demo accounts: Manager (`manager@company.com`), Member (`akila@company.com`), Member with Corrections (`kasun@company.com`).
