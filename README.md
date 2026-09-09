# Weekly Report Generator & Team Dashboard

A modern, full-stack engineering status reporting and review system designed for software teams. The platform provides a fixed-structure weekly reporting flow for team members, an auditable review and correction cycle for managers, immutable version snapshots, and a visual executive analytics dashboard with AI assistance.

Built for the **Technical Software Engineer Assignment**.

---

## 🌟 Key Highlights & Features

1. **Fixed & Standardized Report Structure:**
   - Strict weekly timeframe (Monday – Sunday) and project tagging.
   - Task-level table tracking planned vs actual progress %, planned vs spent hours, priority, and deliverable produced.
   - Tasks planned for next week.
   - Blockers & Challenges with a strict single **"⭐ Key Issue"** toggle.
   - Achievements & Highlights with a strict single **"⭐ Key Win"** toggle.
   - Categorized hours breakdown (Development, QA, Meetings, Docs) with auto-calculated totals.
   - External deliverable links (PRs, Figma, Docs).

2. **Complete Review & Correction Lifecycle:**
   - `DRAFT` &rarr; `SUBMITTED` &rarr; `NEEDS_CORRECTION` &rarr; `RESUBMITTED` &rarr; `APPROVED`.
   - Managers can either **Approve** or **Request Changes** (requiring a general feedback comment).
   - Prominent feedback banners appear on the team member's editing interface when corrections are requested.
   - Resubmissions move the status back to `SUBMITTED` for re-review.

3. **Report Version History & Audit Trail (Bonus Feature):**
   - Every submission and resubmission freezes an immutable snapshot in PostgreSQL (`report_versions`).
   - Managers can inspect previous versions alongside the current active version on demand.
   - Reviewer comments are permanently tied to the specific version they were issued against.

4. **Executive Team Dashboard & Visual Insights (Recharts):**
   - Summary metric cards: Total Submitted, Submission Compliance Rate %, Needs Correction count, Open Blockers.
   - Task completion velocity trend over past 5 weeks (Area chart).
   - Workload distribution across team projects (Donut chart).
   - Time spent by task category (Bar chart).
   - Team member submission status tracking table.
   - Chronological review activity feed.
   - **Side-by-Side View (Bonus):** Consolidated multi-column comparison of all team blockers or achievements for any selected week.

5. **AI Team Assistant (Good-to-Have Feature):**
   - In-app conversational chat widget performing lightweight RAG over stored weekly reports.
   - Instant answers about open blockers, project workload distribution, and executive weekly summaries.

6. **10 Complete Pages Implemented:**
   - `/login` & `/register` (includes 1-click Demo Role Switcher for instant evaluator walkthrough)
   - `/dashboard` (Manager Executive Dashboard)
   - `/reports/new` (Personal Weekly Report Creator)
   - `/reports/[id]/edit` (Report Correction & Resubmission)
   - `/reports/history` (Personal Weekly Report History)
   - `/reports/[id]` (Read-Only Formatted Report View with print support)
   - `/manager/reports/[id]/review` (Dedicated Manager Review & Version Comparison)
   - `/manager/users/[id]` (Team Member Profile & Performance Statistics)
   - `/manager/projects` (Full Project & Category Tag CRUD)
   - `/admin/users` (Admin Role Assignment & User Management)

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Data Viz** | Recharts | Interactive SVG charts (Area, Pie, Bar) |
| **Backend** | NestJS 10 | TypeScript, REST API, Modular Architecture |
| **Database** | PostgreSQL | Relational Schema with Foreign Keys & Indexes |
| **ORM** | Prisma ORM 5 | Type-safe migrations, queries, and seeding |
| **Security** | Passport JWT & bcryptjs | Stateless Bearer auth, RBAC Guards (`@Roles`) |
| **Testing** | Jest & Supertest | Automated RBAC and workflow e2e test suite |

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **npm**: v9+
- **PostgreSQL**: Local PostgreSQL instance or cloud PostgreSQL connection string (Neon, Supabase, etc.)

---

### 1. Database Setup (PostgreSQL)

1. Ensure PostgreSQL is running on your system (default port `5432`).
2. Create a database for the application (e.g. `weekly_report_db`):
   ```sql
   CREATE DATABASE weekly_report_db;
   ```
3. Open `backend/.env` and configure your database connection string:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/weekly_report_db?schema=public"
   JWT_SECRET="weekly_report_super_secret_jwt_key_2026_modern"
   PORT=4000
   FRONTEND_URL="http://localhost:3000"
   ```
4. Push the schema to create the tables:
   ```bash
   cd backend
   npm run prisma:push
   ```
5. Seed the database with realistic multi-user data (5 team members across 4 weeks with drafts, submitted, needs correction, and approved reports):
   ```bash
   npm run prisma:seed
   ```

---

### 2. Running the Backend (NestJS API)

```bash
cd backend
npm run start:dev
```
The backend API server will start on: **`http://localhost:4000`**

---

### 3. Running the Frontend (Next.js Web Application)

In a new terminal window:
```bash
cd frontend
npm run dev
```
The frontend web application will start on: **`http://localhost:3000`**

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 4. Running Automated Tests

Run the automated RBAC and review workflow security test suite:
```bash
cd backend
npm run test:e2e
```
This verifies:
- Horizontal isolation (Team Member B cannot access Team Member A's report).
- Vertical isolation (Team Member cannot approve reports or access manager dashboard).
- Unauthenticated requests are rejected with `401 Unauthorized`.
- Manager review capabilities and permissions.

---

## 👥 Demo Accounts (Pre-Seeded)

The login screen (`/login`) includes a **1-Click Demo Role Switcher** to instantly switch between personas during presentations or evaluation:

| Name | Email | Password | Role | State in Demo |
|---|---|---|---|---|
| **Sarah Jenkins** | `manager@company.com` | `password123` | **MANAGER** | Reviews team reports, inspects dashboard analytics |
| **Akila Madhushanka** | `akila@company.com` | `password123` | **TEAM_MEMBER** | Has active report in `SUBMITTED` status |
| **Kasun Perera** | `kasun@company.com` | `password123` | **TEAM_MEMBER** | Has report in `NEEDS_CORRECTION` status with manager feedback |
| **Nimal Fernando** | `nimal@company.com` | `password123` | **TEAM_MEMBER** | Has report in `DRAFT` status |
| **Amal Silva** | `amal@company.com` | `password123` | **TEAM_MEMBER** | DevOps engineer with weekly submissions |
| **Ravi Kumara** | `ravi@company.com` | `password123` | **TEAM_MEMBER** | QA engineer with automated test reports |
| **Alex Vance** | `admin@company.com` | `password123` | **ADMIN** | Manages system user roles and projects |

---

## 📁 Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL Relational Schema
│   │   └── seed.ts                # Realistic 5-member 4-week seed dataset
│   ├── src/
│   │   ├── auth/                  # JWT auth, register, login, me
│   │   ├── common/                # RolesGuard, JwtAuthGuard, @Roles decorator
│   │   ├── dashboard/             # Aggregated metrics, charts data, side-by-side
│   │   ├── projects/              # Project and category CRUD
│   │   ├── reports/               # Fixed structure CRUD, submit, resubmit
│   │   ├── reviews/               # Approve, request changes, version snapshots
│   │   ├── users/                 # Member profile stats, admin role updates
│   │   ├── ai/                    # Natural language team assistant & summary RAG
│   │   └── main.ts                # Bootstrap, CORS, validation pipe
│   └── test/
│       └── rbac.e2e-spec.ts       # Automated RBAC security tests
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login & register
│   │   │   ├── dashboard/         # Manager Executive Dashboard
│   │   │   ├── reports/           # New, Edit, History, Detail views
│   │   │   ├── manager/           # Review, User Profile, Projects pages
│   │   │   └── admin/             # Role configuration page
│   │   ├── components/            # Reusable UI, TaskTable, Charts, AI widget
│   │   ├── context/               # AuthContext & 1-click persona switcher
│   │   └── lib/api.ts             # Typed REST API client
│
├── diagram/
│   ├── er-diagram.svg             # High-resolution visual ER Diagram
│   └── README.md                  # Database Schema Documentation & Mermaid Diagram
│
└── documentation/
    ├── presentation-deck.md       # Slide-by-slide Google Slides presentation script
    ├── demo-video-guide.md        # 5-8 minute video presentation walkthrough
    └── live-coding-guide.md       # Interview & live coding preparation reference
```

---

## 📄 Deliverables Checklist

- [x] **GitHub Repository:** Full frontend, backend, test suite, and clean documentation.
- [x] **Entity-Relationship Diagram:** Generated in `diagram/er-diagram.svg` and `diagram/README.md`.
- [x] **Technical Presentation Deck:** Slide-by-slide structure in `documentation/presentation-deck.md`.
- [x] **Demo Video Walkthrough Script:** Script and instructions in `documentation/demo-video-guide.md`.
- [x] **Automated RBAC Test Suite:** Implemented in `backend/test/rbac.e2e-spec.ts`.
- [x] **AI Chat Assistant:** Implemented in `backend/src/ai` and `frontend/src/components/ai`.
