# Database Entity-Relationship (ER) Design

This document details the database schema, entity definitions, and relationship architecture for the **Weekly Report Generator & Team Dashboard** system.

The schema is built for **PostgreSQL** using **Prisma ORM** and is illustrated in the visual diagram deliverable:
- [er-diagram.svg](./er-diagram.svg)

---

## 1. Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
    ROLES ||--o{ USERS : "has (1:N)"
    USERS ||--o{ REPORTS : "submits (1:N)"
    USERS ||--o{ REVIEW_COMMENTS : "authors (1:N)"
    PROJECTS ||--o{ REPORTS : "categorizes (1:N)"
    REPORTS ||--o{ REPORT_TASKS : "contains (1:N)"
    REPORTS ||--o{ REPORT_NEXT_TASKS : "plans (1:N)"
    REPORTS ||--o{ REPORT_BLOCKERS : "flags (1:N)"
    REPORTS ||--o{ REPORT_ACHIEVEMENTS : "highlights (1:N)"
    REPORTS ||--o{ REPORT_HOURS : "records (1:N)"
    REPORTS ||--o{ REPORT_VERSIONS : "tracks (1:N)"
    REPORTS ||--o{ REVIEW_COMMENTS : "receives (1:N)"
    REPORT_VERSIONS ||--o{ REVIEW_COMMENTS : "attached_to (1:N)"

    ROLES {
        int id PK
        string name "UNIQUE (TEAM_MEMBER, MANAGER, ADMIN)"
    }

    USERS {
        int id PK
        int role_id FK
        string name
        string email "UNIQUE"
        string password_hash
        string department
        string job_title
        string avatar_url
        datetime created_at
        datetime updated_at
    }

    PROJECTS {
        int id PK
        string name "UNIQUE"
        string color
        string description
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    REPORTS {
        int id PK
        int user_id FK
        int project_id FK
        date week_start
        date week_end
        string status "DRAFT, SUBMITTED, NEEDS_CORRECTION, APPROVED"
        string summary
        text latest_review_comment
        json links
        datetime submitted_at
        datetime approved_at
        datetime created_at
        datetime updated_at
    }

    REPORT_TASKS {
        int id PK
        int report_id FK
        string task_name
        string priority "LOW, MEDIUM, HIGH, URGENT"
        int planned_percent
        int actual_percent
        string status "NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED"
        decimal planned_hours
        decimal spent_hours
        text deliverable
        int order_index
    }

    REPORT_NEXT_TASKS {
        int id PK
        int report_id FK
        string title
        string priority
        decimal planned_hours
        int order_index
    }

    REPORT_BLOCKERS {
        int id PK
        int report_id FK
        text description
        boolean is_key_issue "Flag: single key issue"
        int order_index
    }

    REPORT_ACHIEVEMENTS {
        int id PK
        int report_id FK
        text description
        boolean is_key_achievement "Flag: single key win"
        int order_index
    }

    REPORT_HOURS {
        int id PK
        int report_id FK
        string task_type "Development, Testing, Meetings, Documentation, etc."
        decimal hours
    }

    REPORT_VERSIONS {
        int id PK
        int report_id FK
        int version_number "Sequential: 1, 2, 3..."
        jsonb snapshot_data "Full snapshot of report, tasks, blockers, hours"
        int submitted_by_id FK
        datetime submitted_at
    }

    REVIEW_COMMENTS {
        int id PK
        int report_id FK
        int reviewer_id FK
        int version_id FK "Optional link to specific version"
        string action "REQUEST_CHANGES, APPROVED, COMMENT_ONLY"
        text comment "Mandatory explanation for changes requested"
        datetime created_at
    }
```

---

## 2. Core Entities & Technical Descriptions

### `roles`
Defines Role-Based Access Control (RBAC) levels.
- `TEAM_MEMBER`: Can create, edit, draft, and submit own reports. Can view own history and respond to revision comments.
- `MANAGER`: Can view all team reports, view aggregate analytics dashboard, approve reports, and request corrections with comments.
- `ADMIN`: Has full managerial capabilities plus user role assignment and project administration.

### `users`
Accounts for system access. Stores hashed passwords using `bcrypt` and references role hierarchy.

### `projects`
Work categories/projects (e.g. `Client A`, `Internal Tooling`, `R&D`, `Marketing`). Provides tag-based filtering and workload distribution analytics.

### `reports`
Central aggregate entity representing a team member's weekly report for a date range (Monday to Sunday).
Fixed lifecycle:
```
[DRAFT] ---> [SUBMITTED] ---> [NEEDS_CORRECTION] ---> [SUBMITTED] ---> [APPROVED]
```

### `report_tasks`
Structured task rows containing:
- Planned vs actual progress percentage
- Status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `BLOCKED`)
- Planned hours vs actual spent hours
- Deliverable output produced (PR links, documents, build artifacts)

### `report_blockers` & `report_achievements`
Individual challenges and accomplishments. Supports boolean flags `is_key_issue` and `is_key_achievement` allowing managers to instantly spot critical week highlights.

### `report_hours`
Time allocation category breakdown (Development, Testing, Code Review, Meetings, Documentation).

### `report_versions` & `review_comments` (Bonus Feature)
Ensures full audit compliance. Whenever a report is submitted or resubmitted after correction:
- An immutable snapshot of the report state is archived in `report_versions`.
- Any reviewer feedback is tied to the report and version, preserving historical context.
