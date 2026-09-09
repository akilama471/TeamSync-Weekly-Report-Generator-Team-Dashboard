# Live Coding Round & Architecture Preparation Guide

This guide is designed to help you ace the **Live Coding Round** and confidently explain and modify every part of this codebase in real time.

---

## 1. Quick Architecture Cheat Sheet

### Backend Stack (NestJS 10 + TypeScript + Prisma + PostgreSQL)
- **Entry Point:** `src/main.ts` (Global CORS, `ValidationPipe`, `AllExceptionsFilter`, Port 4000).
- **Relational Schema:** `prisma/schema.prisma`
  - 11 Models: `Role`, `User`, `Project`, `Report`, `ReportTask`, `ReportNextTask`, `ReportBlocker`, `ReportAchievement`, `ReportHour`, `ReportVersion`, `ReviewComment`, `AuditLog`.
- **RBAC Security:**
  - `@Roles(...)` decorator in `src/common/decorators/roles.decorator.ts`
  - `RolesGuard` in `src/common/guards/roles.guard.ts`
  - Hierarchy: `ADMIN` &gt; `MANAGER` &gt; `TEAM_MEMBER`.
- **Review Workflow State Machine:**
  - `DRAFT` &rarr; `SUBMITTED` &rarr; `NEEDS_CORRECTION` &rarr; `RESUBMITTED` &rarr; `APPROVED`.
  - Service methods: `reports.service.ts` (`create`, `update`, `submit`) & `reviews.service.ts` (`approve`, `requestCorrection`, `getVersions`).
- **Data Isolation:**
  - `reports.service.ts`: If `currentUser.role === 'TEAM_MEMBER'`, query is forced to `where: { userId: currentUser.id }`.
  - If a team member attempts to access an ID belonging to another user, `ForbiddenException` (HTTP 403) is thrown immediately.

### Frontend Stack (Next.js 14 App Router + Tailwind CSS + Recharts)
- **State & Session:** `src/context/auth-context.tsx`
  - Persistent Bearer JWT in `localStorage`.
  - Pre-wired 1-click demo switcher (`quickLoginAs(...)`) for Sarah (Manager), Akila (Submitted), Kasun (Needs Correction), Nimal (Draft).
- **Core Pages (All 10+ Pages Implemented):**
  - `/login` & `/register`: Authentication and demo role switcher.
  - `/dashboard`: Executive manager dashboard with metric cards, 4 Recharts visualizations, member submission status table, and side-by-side section comparison modal.
  - `/reports/new`: Standardized report builder with fixed field order.
  - `/reports/[id]/edit`: Resubmit/edit page with prominent manager feedback alert.
  - `/reports/history`: Filterable personal history of past weeks.
  - `/reports/[id]`: Formatted read-only report view.
  - `/manager/reports/[id]/review`: Manager review interface with Approve & Request Changes modals and version snapshots comparison.
  - `/manager/users/[id]`: Member profile with historical stats and compliance rate.
  - `/manager/projects`: Full CRUD for projects and category tags.
  - `/admin/users`: User role configuration.
  - Floating AI Assistant widget: RAG over weekly reports.

---

## 2. Likely Live Coding Tasks & How to Solve Them

### Scenario A: "Add a new field to the report (e.g. 'Team Morale / Happiness Rating (1-5)')"
1. **Database Schema:**
   - In `backend/prisma/schema.prisma`, add to `model Report`:
     ```prisma
     moraleRating Int? @map("morale_rating") // 1 to 5
     ```
   - Run `node node_modules/prisma/build/index.js db push`.
2. **Backend DTO:**
   - In `backend/src/reports/dto/create-report.dto.ts` & `update-report.dto.ts`:
     ```typescript
     @IsOptional()
     @IsInt()
     @Min(1)
     @Max(5)
     moraleRating?: number;
     ```
   - In `backend/src/reports/reports.service.ts`, include `moraleRating: dto.moraleRating` in `create` and `update`.
3. **Frontend Component:**
   - In `frontend/src/app/reports/new/page.tsx` and `[id]/edit/page.tsx`, add a rating slider or select (1-5) and bind to state.

---

### Scenario B: "Add an export to CSV or JSON feature for a weekly report"
- On frontend `frontend/src/app/reports/[id]/page.tsx`:
  ```typescript
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report.id}-week-${report.weekStart}.json`;
    a.click();
  };
  ```

---

### Scenario C: "Write or explain an RBAC test"
- Refer to `backend/test/rbac.e2e-spec.ts`:
  - Show how `supertest` makes a request with Member A's Bearer token to Member B's report ID.
  - Explain how `ReportsService.findOne` checks `if (currentUser.role.name === 'TEAM_MEMBER' && report.userId !== currentUser.id)` and throws `ForbiddenException`.
  - Show how `RolesGuard` checks `@Roles(RoleType.MANAGER, RoleType.ADMIN)` on `POST /reviews/:id/approve` and rejects non-managers with 403.
