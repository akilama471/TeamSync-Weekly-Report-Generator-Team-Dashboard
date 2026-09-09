import { PrismaClient, ReportStatus, TaskPriority, TaskStatus, ReviewAction } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { subWeeks, startOfWeek, endOfWeek, format } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Weekly Report Generator & Team Dashboard...');

  // Clean existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.reviewComment.deleteMany();
  await prisma.reportVersion.deleteMany();
  await prisma.reportHour.deleteMany();
  await prisma.reportAchievement.deleteMany();
  await prisma.reportBlocker.deleteMany();
  await prisma.reportNextTask.deleteMany();
  await prisma.reportTask.deleteMany();
  await prisma.report.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // 1. Seed Roles
  console.log('Creating Roles: TEAM_MEMBER, MANAGER, ADMIN...');
  const roleMember = await prisma.role.create({ data: { name: 'TEAM_MEMBER' } });
  const roleManager = await prisma.role.create({ data: { name: 'MANAGER' } });
  const roleAdmin = await prisma.role.create({ data: { name: 'ADMIN' } });

  // Common password hash for test accounts: "password123"
  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Seed Users
  console.log('Creating Users (Manager, Admin, and 5 Team Members)...');
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@company.com',
      passwordHash,
      name: 'Sarah Jenkins',
      roleId: roleManager.id,
      department: 'Engineering Leadership',
      jobTitle: 'Engineering Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      passwordHash,
      name: 'Alex Vance',
      roleId: roleAdmin.id,
      department: 'Infrastructure',
      jobTitle: 'System Administrator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const akilaUser = await prisma.user.create({
    data: {
      email: 'akila@company.com',
      passwordHash,
      name: 'Akila Madhushanka',
      roleId: roleMember.id,
      department: 'Core Product Team',
      jobTitle: 'Senior Full Stack Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const kasunUser = await prisma.user.create({
    data: {
      email: 'kasun@company.com',
      passwordHash,
      name: 'Kasun Perera',
      roleId: roleMember.id,
      department: 'Frontend Engineering',
      jobTitle: 'Frontend Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  const nimalUser = await prisma.user.create({
    data: {
      email: 'nimal@company.com',
      passwordHash,
      name: 'Nimal Fernando',
      roleId: roleMember.id,
      department: 'Platform Architecture',
      jobTitle: 'Backend Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
  });

  const amalUser = await prisma.user.create({
    data: {
      email: 'amal@company.com',
      passwordHash,
      name: 'Amal Silva',
      roleId: roleMember.id,
      department: 'DevOps & Reliability',
      jobTitle: 'Cloud Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
  });

  const raviUser = await prisma.user.create({
    data: {
      email: 'ravi@company.com',
      passwordHash,
      name: 'Ravi Kumara',
      roleId: roleMember.id,
      department: 'Quality Assurance',
      jobTitle: 'QA Automation Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    },
  });

  // 3. Seed Projects
  console.log('Creating Work Projects / Categories...');
  const projClientA = await prisma.project.create({
    data: {
      name: 'Client A - FinTech Banking System',
      code: 'CLT-FIN',
      description: 'Enterprise online banking portal with multi-factor auth and transaction ledger.',
      color: '#3b82f6', // Blue
    },
  });

  const projInternal = await prisma.project.create({
    data: {
      name: 'Internal Tooling & CI/CD Pipelines',
      code: 'INT-DEVOPS',
      description: 'Infrastructure automation, microservices tooling, and performance testing suites.',
      color: '#10b981', // Emerald
    },
  });

  const projRD = await prisma.project.create({
    data: {
      name: 'R&D - Next-Gen AI Assistant',
      code: 'RD-AI',
      description: 'Exploring LLM integration and semantic report analytics for management intelligence.',
      color: '#8b5cf6', // Purple
    },
  });

  const projMarketing = await prisma.project.create({
    data: {
      name: 'Marketing & Public Portal',
      code: 'MKT-PORTAL',
      description: 'Public landing pages, documentation site, and user onboarding flows.',
      color: '#f59e0b', // Amber
    },
  });

  // 4. Calculate Past 4 Calendar Weeks (Monday to Sunday)
  const now = new Date();
  const weeks = [3, 2, 1, 0].map((offset) => {
    const targetDate = subWeeks(now, offset);
    return {
      weekStart: startOfWeek(targetDate, { weekStartsOn: 1 }),
      weekEnd: endOfWeek(targetDate, { weekStartsOn: 1 }),
    };
  });

  console.log('Creating Reports with diverse statuses, version histories, and tasks...');

  // -------------------------------------------------------------
  // Akila Madhushanka:
  // Week 0: Approved
  // Week 1: Approved
  // Week 2: Approved
  // Week 3 (Current): Submitted (Waiting for Manager Review)
  // -------------------------------------------------------------
  for (let i = 0; i < 4; i++) {
    const isCurrent = i === 3;
    const status = isCurrent ? ReportStatus.SUBMITTED : ReportStatus.APPROVED;

    const rep = await prisma.report.create({
      data: {
        userId: akilaUser.id,
        projectId: i % 2 === 0 ? projClientA.id : projRD.id,
        weekStart: weeks[i].weekStart,
        weekEnd: weeks[i].weekEnd,
        status,
        summary: `Akila's progress for Week ${i + 1}: Focused on authentication services, database optimization, and dashboard queries.`,
        notes: 'Coordinated with DevOps for migration scripts and staging deployment.',
        links: [
          { title: 'Pull Request #102: JWT Auth', url: 'https://github.com/company/repo/pull/102' },
          { title: 'Figma: Dashboard Spec', url: 'https://figma.com/file/sample' },
        ],
        submittedAt: weeks[i].weekEnd,
        approvedAt: status === ReportStatus.APPROVED ? weeks[i].weekEnd : null,
        tasks: {
          create: [
            {
              taskName: 'Implement JWT authentication & RBAC guards',
              priority: TaskPriority.HIGH,
              plannedPercent: 100,
              actualPercent: 100,
              status: TaskStatus.COMPLETED,
              plannedHours: 12.0,
              spentHours: 11.5,
              deliverable: 'PR #102 merged into main with 100% test pass rate',
              orderIndex: 0,
            },
            {
              taskName: 'Optimize PostgreSQL query execution plans for dashboard metrics',
              priority: TaskPriority.MEDIUM,
              plannedPercent: 100,
              actualPercent: isCurrent ? 85 : 100,
              status: isCurrent ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED,
              plannedHours: 10.0,
              spentHours: 9.0,
              deliverable: 'Database index migration file in /prisma/migrations',
              orderIndex: 1,
            },
            {
              taskName: 'Create Recharts visual components for team analytics',
              priority: TaskPriority.HIGH,
              plannedPercent: 100,
              actualPercent: 100,
              status: TaskStatus.COMPLETED,
              plannedHours: 14.0,
              spentHours: 14.0,
              deliverable: 'Frontend charting widgets in /components/dashboard',
              orderIndex: 2,
            },
          ],
        },
        nextTasks: {
          create: [
            { title: 'Perform load testing on report submission endpoint', priority: TaskPriority.HIGH, plannedHours: 8.0, orderIndex: 0 },
            { title: 'Integrate LLM summarization pipeline for team blockers', priority: TaskPriority.MEDIUM, plannedHours: 12.0, orderIndex: 1 },
          ],
        },
        blockers: {
          create: [
            {
              description: 'Staging database credentials took 24 hours to obtain from security compliance.',
              impact: 'Minor delay resolved after admin approval.',
              isKeyIssue: true,
              orderIndex: 0,
            },
          ],
        },
        achievements: {
          create: [
            {
              description: 'Reduced dashboard API response latency from 320ms to 48ms using optimized aggregates.',
              isKeyAchievement: true,
              orderIndex: 0,
            },
          ],
        },
        hours: {
          create: [
            { taskType: 'Development', hours: 26.0 },
            { taskType: 'Code Review', hours: 4.5 },
            { taskType: 'Meetings', hours: 3.5 },
            { taskType: 'Documentation', hours: 3.0 },
          ],
        },
      },
    });

    // Version snapshot
    await prisma.reportVersion.create({
      data: {
        reportId: rep.id,
        versionNumber: 1,
        snapshotData: {
          summary: rep.summary,
          status: rep.status,
          week: format(weeks[i].weekStart, 'yyyy-MM-dd'),
          tasksCount: 3,
        },
        submittedById: akilaUser.id,
        submittedAt: weeks[i].weekEnd,
      },
    });

    if (status === ReportStatus.APPROVED) {
      await prisma.reviewComment.create({
        data: {
          reportId: rep.id,
          reviewerId: managerUser.id,
          action: ReviewAction.APPROVED,
          comment: 'Outstanding progress on authentication architecture and query optimization. Approved!',
        },
      });
    }
  }

  // -------------------------------------------------------------
  // Kasun Perera (Frontend Engineer):
  // Demonstrates the full correction cycle:
  // Week 3 (Current): NEEDS_CORRECTION (Manager requested changes)
  // -------------------------------------------------------------
  const kasunReportWeek3 = await prisma.report.create({
    data: {
      userId: kasunUser.id,
      projectId: projClientA.id,
      weekStart: weeks[3].weekStart,
      weekEnd: weeks[3].weekEnd,
      status: ReportStatus.NEEDS_CORRECTION,
      summary: 'Worked on mobile responsive layouts for report submission forms and task tables.',
      latestReviewComment: 'Please update the actual completion percentages for the mobile navigation task and add the missing Figma deliverable link.',
      notes: 'Had CSS grid breakpoint overflow on tablet viewports.',
      submittedAt: weeks[3].weekEnd,
      tasks: {
        create: [
          {
            taskName: 'Build responsive task-level table with priority badges',
            priority: TaskPriority.HIGH,
            plannedPercent: 100,
            actualPercent: 100,
            status: TaskStatus.COMPLETED,
            plannedHours: 16.0,
            spentHours: 15.0,
            deliverable: 'TaskTable.tsx component merged',
            orderIndex: 0,
          },
          {
            taskName: 'Mobile navigation drawer and touch gestures',
            priority: TaskPriority.MEDIUM,
            plannedPercent: 100,
            actualPercent: 60,
            status: TaskStatus.IN_PROGRESS,
            plannedHours: 12.0,
            spentHours: 14.0,
            deliverable: 'Pending Figma review',
            orderIndex: 1,
          },
        ],
      },
      nextTasks: {
        create: [
          { title: 'Refactor modal dialogs for screen-reader accessibility', priority: TaskPriority.MEDIUM, plannedHours: 10.0, orderIndex: 0 },
        ],
      },
      blockers: {
        create: [
          {
            description: 'Unclear mobile design requirements for complex nested data tables.',
            impact: 'Blocked full sign-off.',
            isKeyIssue: true,
            orderIndex: 0,
          },
        ],
      },
      achievements: {
        create: [
          {
            description: 'Achieved 98/100 Lighthouse performance score on modern Next.js client bundle.',
            isKeyAchievement: true,
            orderIndex: 0,
          },
        ],
      },
      hours: {
        create: [
          { taskType: 'Development', hours: 22.0 },
          { taskType: 'Testing', hours: 6.0 },
          { taskType: 'Meetings', hours: 4.0 },
        ],
      },
    },
  });

  // Version 1 snapshot for Kasun
  const kasunV1 = await prisma.reportVersion.create({
    data: {
      reportId: kasunReportWeek3.id,
      versionNumber: 1,
      snapshotData: {
        summary: kasunReportWeek3.summary,
        status: ReportStatus.SUBMITTED,
        tasks: ['Build responsive task-level table', 'Mobile navigation drawer'],
      },
      submittedById: kasunUser.id,
      submittedAt: weeks[3].weekEnd,
    },
  });

  // Manager review requesting changes
  await prisma.reviewComment.create({
    data: {
      reportId: kasunReportWeek3.id,
      reviewerId: managerUser.id,
      versionId: kasunV1.id,
      action: ReviewAction.REQUEST_CHANGES,
      comment: 'Please update the actual completion percentages for the mobile navigation task and add the missing Figma deliverable link.',
    },
  });

  // Kasun's earlier approved weeks
  for (let i = 0; i < 3; i++) {
    await prisma.report.create({
      data: {
        userId: kasunUser.id,
        projectId: projClientA.id,
        weekStart: weeks[i].weekStart,
        weekEnd: weeks[i].weekEnd,
        status: ReportStatus.APPROVED,
        summary: `Kasun Week ${i + 1} completed frontend sprints.`,
        submittedAt: weeks[i].weekEnd,
        approvedAt: weeks[i].weekEnd,
        tasks: {
          create: [
            {
              taskName: 'UI component library integration with Tailwind and Radix primitives',
              priority: TaskPriority.HIGH,
              plannedPercent: 100,
              actualPercent: 100,
              status: TaskStatus.COMPLETED,
              plannedHours: 20.0,
              spentHours: 19.0,
              deliverable: 'UI kit established in /components/ui',
              orderIndex: 0,
            },
          ],
        },
        hours: {
          create: [{ taskType: 'Development', hours: 30.0 }, { taskType: 'Meetings', hours: 5.0 }],
        },
      },
    });
  }

  // -------------------------------------------------------------
  // Nimal Fernando (Backend Engineer):
  // Demonstrates a Draft report in progress
  // -------------------------------------------------------------
  await prisma.report.create({
    data: {
      userId: nimalUser.id,
      projectId: projInternal.id,
      weekStart: weeks[3].weekStart,
      weekEnd: weeks[3].weekEnd,
      status: ReportStatus.DRAFT,
      summary: 'Drafting current week deliverables for Kafka streaming consumer and worker jobs.',
      tasks: {
        create: [
          {
            taskName: 'Setup BullMQ worker queues for async report PDF generation',
            priority: TaskPriority.MEDIUM,
            plannedPercent: 100,
            actualPercent: 40,
            status: TaskStatus.IN_PROGRESS,
            plannedHours: 14.0,
            spentHours: 8.0,
            deliverable: 'Draft branch feature/pdf-workers',
            orderIndex: 0,
          },
        ],
      },
      blockers: {
        create: [
          {
            description: 'Redis cluster memory thresholds need adjustment.',
            isKeyIssue: true,
            orderIndex: 0,
          },
        ],
      },
      hours: {
        create: [{ taskType: 'Development', hours: 18.0 }, { taskType: 'Documentation', hours: 3.0 }],
      },
    },
  });

  // Nimal's approved past weeks
  for (let i = 0; i < 3; i++) {
    await prisma.report.create({
      data: {
        userId: nimalUser.id,
        projectId: projInternal.id,
        weekStart: weeks[i].weekStart,
        weekEnd: weeks[i].weekEnd,
        status: ReportStatus.APPROVED,
        summary: `Nimal Week ${i + 1}: NestJS REST endpoints and Prisma migrations completed.`,
        submittedAt: weeks[i].weekEnd,
        approvedAt: weeks[i].weekEnd,
        tasks: {
          create: [
            {
              taskName: 'Design relational schema and foreign key indexes',
              priority: TaskPriority.HIGH,
              plannedPercent: 100,
              actualPercent: 100,
              status: TaskStatus.COMPLETED,
              plannedHours: 15.0,
              spentHours: 14.0,
              deliverable: 'schema.prisma verified',
              orderIndex: 0,
            },
          ],
        },
        hours: {
          create: [{ taskType: 'Development', hours: 28.0 }],
        },
      },
    });
  }

  // -------------------------------------------------------------
  // Amal Silva (DevOps Engineer):
  // -------------------------------------------------------------
  for (let i = 0; i < 4; i++) {
    const isCurrent = i === 3;
    await prisma.report.create({
      data: {
        userId: amalUser.id,
        projectId: projInternal.id,
        weekStart: weeks[i].weekStart,
        weekEnd: weeks[i].weekEnd,
        status: isCurrent ? ReportStatus.SUBMITTED : ReportStatus.APPROVED,
        summary: `Amal Week ${i + 1}: CI/CD pipeline automation and Kubernetes manifests.`,
        submittedAt: weeks[i].weekEnd,
        approvedAt: isCurrent ? null : weeks[i].weekEnd,
        tasks: {
          create: [
            {
              taskName: 'Automated GitHub Actions workflow for linting, testing, and Docker builds',
              priority: TaskPriority.HIGH,
              plannedPercent: 100,
              actualPercent: 100,
              status: TaskStatus.COMPLETED,
              plannedHours: 18.0,
              spentHours: 16.0,
              deliverable: '.github/workflows/ci.yml deployed',
              orderIndex: 0,
            },
          ],
        },
        hours: {
          create: [{ taskType: 'Development', hours: 25.0 }, { taskType: 'Meetings', hours: 4.0 }],
        },
      },
    });
  }

  // -------------------------------------------------------------
  // Ravi Kumara (QA Engineer):
  // -------------------------------------------------------------
  for (let i = 0; i < 4; i++) {
    const isCurrent = i === 3;
    await prisma.report.create({
      data: {
        userId: raviUser.id,
        projectId: projClientA.id,
        weekStart: weeks[i].weekStart,
        weekEnd: weeks[i].weekEnd,
        status: isCurrent ? ReportStatus.SUBMITTED : ReportStatus.APPROVED,
        summary: `Ravi Week ${i + 1}: End-to-end regression suites and RBAC security test scenarios.`,
        submittedAt: weeks[i].weekEnd,
        approvedAt: isCurrent ? null : weeks[i].weekEnd,
        tasks: {
          create: [
            {
              taskName: 'Automate RBAC forbidden access tests using Playwright & Supertest',
              priority: TaskPriority.HIGH,
              plannedPercent: 100,
              actualPercent: 100,
              status: TaskStatus.COMPLETED,
              plannedHours: 16.0,
              spentHours: 15.0,
              deliverable: 'e2e test suite passing in CI',
              orderIndex: 0,
            },
          ],
        },
        hours: {
          create: [{ taskType: 'Testing', hours: 24.0 }, { taskType: 'Documentation', hours: 6.0 }],
        },
      },
    });
  }

  console.log('✅ Database seeded successfully with 7 users, 4 projects, and realistic reports across 4 weeks!');
}

main()
  .catch((e) => {
    console.error('❌ Error while seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
