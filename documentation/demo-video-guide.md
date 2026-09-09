# Video Explanation & Demo Walkthrough Script

This script helps you record your demonstration video according to the exact instructions in **Section 4 & Section 43** of the Technical Assignment:
- **Camera:** Keep your webcam turned on with your face visible while presenting.
- **Scope:** Stay inside the application UI (no need to show raw SQL or terminal queries).
- **Duration:** 5–8 minutes.

---

## 1. Introduction (0:00 – 0:45)
- **Visual:** Presenter webcam on top-right, showing the Landing Page (`http://localhost:3000`).
- **Talking Points:**
  - Introduce yourself: *"Hello, my name is Akila Madhushanka. Today I'm demonstrating the Weekly Report Generator & Team Dashboard."*
  - Explain the purpose: Multi-user sprint tracking, standardized reports, manager review workflow, version audit snapshots, and executive visual insights.
  - Mention the stack: Next.js + TypeScript, NestJS + PostgreSQL + Prisma ORM.

---

## 2. Team Member Persona Walkthrough (0:45 – 2:30)
- **Action:**
  - Go to `/login`. Use the 1-click demo button **"Akila (Member - Submitted)"** or log in with `akila@company.com` / `password123`.
- **Show Personal Report Form (`/reports/new`):**
  - Highlight the fixed identical structure:
    1. Week range (Monday to Sunday)
    2. Project / Category tag (e.g. Client A)
    3. Tasks table: Planned % vs Actual %, Status, Planned vs Spent Time, Deliverable output.
    4. Tasks planned for next week.
    5. Blockers & Challenges: Click **"Flag as Key"** on one blocker to demonstrate the single key issue requirement.
    6. Achievements & Highlights: Click **"Flag as Key"** on one win.
    7. Hours breakdown by task type with auto-calculated total.
    8. Notes and PR links.
- **Show Report History (`/reports/history`):**
  - Filter by project and status.
  - Show past weeks with status badges (`Draft`, `Submitted`, `Needs Correction`, `Approved`).

---

## 3. Manager Review & Correction Workflow Cycle (2:30 – 4:30)
*(This is the core required workflow evaluated by the panel!)*
- **Step A:** Switch to **Sarah (Manager)** (`manager@company.com`).
- **Step B: Open Kasun's report (`/manager/reports/5/review`):**
  - Show that Kasun's report has a requested change.
  - Demonstrate the **Version Snapshots** tabs:
    - Click **"Version 1"** &rarr; show previous snapshot.
    - Click **"Current Active Version"** &rarr; show latest submission.
- **Step C: Request Changes Demo:**
  - Click **"Request Changes"** &rarr; modal opens requiring a comment:
    - Enter: *"Please update the actual completion percentages and include the missing Figma design link."*
    - Click **"Send Back for Correction"** &rarr; status updates immediately to `NEEDS_CORRECTION`.
- **Step D: Team Member Correction:**
  - Switch back to **Kasun (`kasun@company.com`)**.
  - Open `/reports/5/edit` &rarr; show the prominent red **Manager Requested Corrections** banner displaying Sarah's feedback!
  - Update actual percentage to 100% and add the deliverable.
  - Click **"Resubmit Corrected Report"** &rarr; status moves back to `SUBMITTED`, creating Version 2.
- **Step E: Manager Approval:**
  - Switch back to **Sarah (Manager)**.
  - Open report and click **"Approve Report"** &rarr; moves to `APPROVED` with approval timestamp.

---

## 4. Multi-User Dashboard & Visual Insights (4:30 – 6:00)
- **Go to `/dashboard`:**
  - Show top summary metrics: Total Submitted (e.g. 5/5), Compliance Rate (100%), Needs Correction count, Open Blockers.
  - Demonstrate week selector dropdown (switch between past weeks).
  - Show Recharts Visualizations:
    1. **Task Completion Velocity Trend:** Area chart over the past 5 weeks.
    2. **Workload Distribution:** Interactive donut chart showing hours per project.
    3. **Time by Task Category:** Bar chart of Development vs QA vs Meetings.
    4. **Team Member Status Table:** Showing status across all 5 team members (Akila, Kasun, Nimal, Amal, Ravi).
  - Click **"Side-by-Side View"** (Bonus Feature):
    - Switch between all team Blockers and all team Achievements side-by-side!

---

## 5. Good-to-Have Bonus: AI Assistant Demo (6:00 – 7:00)
- Click the floating **AI Team Assistant** widget on the bottom right.
- Click quick prompt: *"What are the key blockers this week?"* &rarr; AI analyzes PostgreSQL reports and answers.
- Click: *"Summarize this week team activity"* &rarr; AI produces an executive bulleted summary.

---

## 6. Management Pages & Wrap-Up (7:00 – 7:30)
- Show **Project Management (`/manager/projects`)**: CRUD for project initiatives.
- Show **User Management (`/admin/users`)**: Role assignment and security access.
- Conclude: Thank the reviewers and mention the repository README has complete setup instructions.
