import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportStatus, TaskPriority, TaskStatus } from '@prisma/client';
import { RoleType } from '../common/constants/roles.constant';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new weekly report.
   * Default state is DRAFT unless submitImmediately is requested.
   */
  async create(userId: number, dto: CreateReportDto) {
    const weekStartDate = new Date(dto.weekStart);
    const weekEndDate = new Date(dto.weekEnd);

    // Verify no existing report exists for this user and week
    const existing = await this.prisma.report.findFirst({
      where: {
        userId,
        weekStart: weekStartDate,
      },
    });

    if (existing) {
      throw new ConflictException(
        `A report for week starting ${dto.weekStart} already exists for your account. Please edit existing report #${existing.id}.`,
      );
    }

    // Verify project exists and is active
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new BadRequestException(`Project with ID ${dto.projectId} does not exist`);
    }

    const status = dto.submitImmediately ? ReportStatus.SUBMITTED : ReportStatus.DRAFT;

    // Normalize blockers: only one can be key issue
    let hasKeyIssue = false;
    const normalizedBlockers = (dto.blockers || []).map((b, idx) => {
      const isKey = !hasKeyIssue && !!b.isKeyIssue;
      if (isKey) hasKeyIssue = true;
      return {
        description: b.description,
        impact: b.impact,
        isKeyIssue: isKey,
        orderIndex: idx,
      };
    });

    // Normalize achievements: only one can be key achievement
    let hasKeyWin = false;
    const normalizedAchievements = (dto.achievements || []).map((a, idx) => {
      const isKey = !hasKeyWin && !!a.isKeyAchievement;
      if (isKey) hasKeyWin = true;
      return {
        description: a.description,
        isKeyAchievement: isKey,
        orderIndex: idx,
      };
    });

    const report = await this.prisma.report.create({
      data: {
        userId,
        projectId: dto.projectId,
        weekStart: weekStartDate,
        weekEnd: weekEndDate,
        status,
        summary: dto.summary,
        notes: dto.notes,
        links: dto.links as any,
        submittedAt: dto.submitImmediately ? new Date() : null,
        tasks: {
          create: dto.tasks.map((t, idx) => ({
            taskName: t.taskName,
            priority: t.priority || TaskPriority.MEDIUM,
            plannedPercent: t.plannedPercent,
            actualPercent: t.actualPercent,
            status: t.status,
            plannedHours: t.plannedHours,
            spentHours: t.spentHours,
            deliverable: t.deliverable,
            orderIndex: idx,
          })),
        },
        nextTasks: {
          create: (dto.nextTasks || []).map((nt, idx) => ({
            title: nt.title,
            priority: nt.priority || TaskPriority.MEDIUM,
            plannedHours: nt.plannedHours || 0,
            orderIndex: idx,
          })),
        },
        blockers: {
          create: normalizedBlockers,
        },
        achievements: {
          create: normalizedAchievements,
        },
        hours: {
          create: (dto.hours || []).map((h) => ({
            taskType: h.taskType,
            hours: h.hours,
          })),
        },
      },
      include: {
        project: true,
        tasks: true,
        nextTasks: true,
        blockers: true,
        achievements: true,
        hours: true,
      },
    });

    // If submitted immediately, archive Version 1 snapshot
    if (dto.submitImmediately) {
      await this.createVersionSnapshot(report.id, 1, userId, report);
    }

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: dto.submitImmediately ? 'REPORT_SUBMITTED' : 'REPORT_DRAFT_CREATED',
        details: { reportId: report.id, weekStart: dto.weekStart },
      },
    });

    return report;
  }

  /**
   * Update an existing report.
   * Allowed only when report status is DRAFT or NEEDS_CORRECTION, and user is the owner.
   */
  async update(id: number, currentUser: any, dto: UpdateReportDto) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // RBAC: Only owner or ADMIN can update report contents
    if (currentUser.role.name === RoleType.TEAM_MEMBER && report.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied: You can only edit your own reports');
    }

    // Workflow rule: Only DRAFT or NEEDS_CORRECTION reports can be edited
    if (report.status !== ReportStatus.DRAFT && report.status !== ReportStatus.NEEDS_CORRECTION) {
      throw new BadRequestException(
        `Report in status "${report.status}" cannot be modified. Only DRAFT or NEEDS_CORRECTION reports can be edited.`,
      );
    }

    // Update main report scalar fields
    const updated = await this.prisma.$transaction(async (tx) => {
      // If tasks array provided, replace child tasks
      if (dto.tasks) {
        await tx.reportTask.deleteMany({ where: { reportId: id } });
        await tx.reportTask.createMany({
          data: dto.tasks.map((t, idx) => ({
            reportId: id,
            taskName: t.taskName,
            priority: t.priority || TaskPriority.MEDIUM,
            plannedPercent: t.plannedPercent,
            actualPercent: t.actualPercent,
            status: t.status,
            plannedHours: t.plannedHours,
            spentHours: t.spentHours,
            deliverable: t.deliverable,
            orderIndex: idx,
          })),
        });
      }

      if (dto.nextTasks) {
        await tx.reportNextTask.deleteMany({ where: { reportId: id } });
        await tx.reportNextTask.createMany({
          data: dto.nextTasks.map((nt, idx) => ({
            reportId: id,
            title: nt.title,
            priority: nt.priority || TaskPriority.MEDIUM,
            plannedHours: nt.plannedHours || 0,
            orderIndex: idx,
          })),
        });
      }

      if (dto.blockers) {
        await tx.reportBlocker.deleteMany({ where: { reportId: id } });
        let hasKey = false;
        await tx.reportBlocker.createMany({
          data: dto.blockers.map((b, idx) => {
            const isKey = !hasKey && !!b.isKeyIssue;
            if (isKey) hasKey = true;
            return {
              reportId: id,
              description: b.description,
              impact: b.impact,
              isKeyIssue: isKey,
              orderIndex: idx,
            };
          }),
        });
      }

      if (dto.achievements) {
        await tx.reportAchievement.deleteMany({ where: { reportId: id } });
        let hasWin = false;
        await tx.reportAchievement.createMany({
          data: dto.achievements.map((a, idx) => {
            const isKey = !hasWin && !!a.isKeyAchievement;
            if (isKey) hasWin = true;
            return {
              reportId: id,
              description: a.description,
              isKeyAchievement: isKey,
              orderIndex: idx,
            };
          }),
        });
      }

      if (dto.hours) {
        await tx.reportHour.deleteMany({ where: { reportId: id } });
        await tx.reportHour.createMany({
          data: dto.hours.map((h) => ({
            reportId: id,
            taskType: h.taskType,
            hours: h.hours,
          })),
        });
      }

      return tx.report.update({
        where: { id },
        data: {
          projectId: dto.projectId,
          summary: dto.summary,
          notes: dto.notes,
          links: dto.links ? (dto.links as any) : undefined,
        },
        include: {
          project: true,
          tasks: true,
          nextTasks: true,
          blockers: true,
          achievements: true,
          hours: true,
        },
      });
    });

    // If submit immediately requested during edit
    if (dto.submitImmediately) {
      return this.submit(id, currentUser);
    }

    return updated;
  }

  /**
   * Submit or Resubmit a report for manager review.
   * - Transitions DRAFT -> SUBMITTED (Version 1)
   * - Transitions NEEDS_CORRECTION -> SUBMITTED (Version N+1)
   */
  async submit(id: number, currentUser: any) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        project: true,
        tasks: true,
        nextTasks: true,
        blockers: true,
        achievements: true,
        hours: true,
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    if (currentUser.role.name === RoleType.TEAM_MEMBER && report.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied: You can only submit your own report');
    }

    if (report.status !== ReportStatus.DRAFT && report.status !== ReportStatus.NEEDS_CORRECTION) {
      throw new BadRequestException(
        `Report cannot be submitted. Current status is ${report.status}. Only DRAFT or NEEDS_CORRECTION reports can be submitted.`,
      );
    }

    if (!report.tasks || report.tasks.length === 0) {
      throw new BadRequestException('A weekly report must contain at least one task entry before submission');
    }

    const nextVersionNumber = report.versions.length > 0 ? report.versions[0].versionNumber + 1 : 1;

    // Archive immutable snapshot
    await this.createVersionSnapshot(report.id, nextVersionNumber, currentUser.id, report);

    const updated = await this.prisma.report.update({
      where: { id },
      data: {
        status: ReportStatus.SUBMITTED,
        submittedAt: new Date(),
      },
      include: {
        project: true,
        tasks: true,
        nextTasks: true,
        blockers: true,
        achievements: true,
        hours: true,
        versions: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: 'REPORT_SUBMITTED_FOR_REVIEW',
        details: { reportId: id, version: nextVersionNumber },
      },
    });

    return updated;
  }

  /**
   * List reports with filtering and pagination.
   * RBAC:
   * - TEAM_MEMBER: restricted strictly to own reports (userId = currentUser.id).
   * - MANAGER / ADMIN: can query across team members or filter by userId.
   */
  async findAll(currentUser: any, query: ReportQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    // RBAC check
    if (currentUser.role.name === RoleType.TEAM_MEMBER) {
      where.userId = currentUser.id;
    } else if (query.userId) {
      where.userId = Number(query.userId);
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.projectId) {
      where.projectId = Number(query.projectId);
    }

    if (query.weekStart) {
      where.weekStart = new Date(query.weekStart);
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { weekStart: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true, department: true } },
          project: { select: { id: true, name: true, color: true, code: true } },
          _count: {
            select: { tasks: true, blockers: true, achievements: true, versions: true, reviewComments: true },
          },
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      data: reports,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single report details by ID.
   * RBAC: TEAM_MEMBER can only view own report. MANAGER / ADMIN can view any.
   */
  async findOne(id: number, currentUser: any) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, department: true, jobTitle: true } },
        project: true,
        tasks: { orderBy: { orderIndex: 'asc' } },
        nextTasks: { orderBy: { orderIndex: 'asc' } },
        blockers: { orderBy: { orderIndex: 'asc' } },
        achievements: { orderBy: { orderIndex: 'asc' } },
        hours: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
          include: {
            submittedBy: { select: { id: true, name: true } },
            comments: {
              include: { reviewer: { select: { id: true, name: true } } },
            },
          },
        },
        reviewComments: {
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // RBAC check: Team member cannot view another member's report
    if (currentUser.role.name === RoleType.TEAM_MEMBER && report.userId !== currentUser.id) {
      throw new ForbiddenException('Access denied: You do not have permission to view this report');
    }

    return report;
  }

  /**
   * Helper to create immutable snapshot in report_versions
   */
  private async createVersionSnapshot(reportId: number, versionNumber: number, submittedById: number, reportData: any) {
    return this.prisma.reportVersion.create({
      data: {
        reportId,
        versionNumber,
        submittedById,
        snapshotData: {
          summary: reportData.summary,
          notes: reportData.notes,
          links: reportData.links,
          tasks: reportData.tasks,
          nextTasks: reportData.nextTasks,
          blockers: reportData.blockers,
          achievements: reportData.achievements,
          hours: reportData.hours,
          submittedAt: new Date().toISOString(),
        },
      },
    });
  }
}
