import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';
import { ReportStatus, TaskStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Executive summary metrics for the dashboard top cards.
   */
  async getSummary(weekStartStr?: string) {
    let weekStartDate: Date;
    if (weekStartStr) {
      weekStartDate = new Date(weekStartStr);
    } else {
      weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    }

    const totalTeamMembers = await this.prisma.user.count({
      where: { role: { name: 'TEAM_MEMBER' } },
    });

    const reportsThisWeek = await this.prisma.report.findMany({
      where: { weekStart: weekStartDate },
      include: { blockers: true, tasks: true },
    });

    const submittedCount = reportsThisWeek.filter(
      (r) => r.status === ReportStatus.SUBMITTED || r.status === ReportStatus.APPROVED,
    ).length;

    const needsCorrectionCount = reportsThisWeek.filter(
      (r) => r.status === ReportStatus.NEEDS_CORRECTION,
    ).length;

    const openBlockersCount = reportsThisWeek.reduce(
      (acc, r) => acc + (r.blockers ? r.blockers.length : 0),
      0,
    );

    // Compliance rate: (Submitted + Approved) / Total Active Team Members
    const complianceRate = totalTeamMembers > 0
      ? Math.min(100, Math.round((submittedCount / totalTeamMembers) * 100))
      : 0;

    return {
      selectedWeek: format(weekStartDate, 'yyyy-MM-dd'),
      totalTeamMembers,
      submittedCount,
      complianceRate,
      needsCorrectionCount,
      openBlockersCount,
    };
  }

  /**
   * Task completion trend over the past 4-6 weeks.
   */
  async getTaskTrends() {
    const now = new Date();
    const trendData = [];

    for (let i = 4; i >= 0; i--) {
      const targetDate = subWeeks(now, i);
      const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });

      const reports = await this.prisma.report.findMany({
        where: { weekStart },
        include: { tasks: true },
      });

      let totalTasks = 0;
      let completedTasks = 0;

      reports.forEach((rep) => {
        rep.tasks.forEach((t) => {
          totalTasks++;
          if (t.status === TaskStatus.COMPLETED || t.actualPercent === 100) {
            completedTasks++;
          }
        });
      });

      trendData.push({
        week: format(weekStart, 'MMM dd'),
        weekStart: format(weekStart, 'yyyy-MM-dd'),
        completedTasks,
        totalTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      });
    }

    return trendData;
  }

  /**
   * Report status for all team members for a selected week.
   */
  async getMemberStatus(weekStartStr?: string) {
    const targetDate = weekStartStr ? new Date(weekStartStr) : new Date();
    const weekStartDate = startOfWeek(targetDate, { weekStartsOn: 1 });

    const teamMembers = await this.prisma.user.findMany({
      where: { role: { name: 'TEAM_MEMBER' } },
      select: { id: true, name: true, email: true, avatarUrl: true, department: true },
      orderBy: { name: 'asc' },
    });

    const reports = await this.prisma.report.findMany({
      where: { weekStart: weekStartDate },
      include: { project: true },
    });

    const reportMap = new Map<number, any>();
    reports.forEach((r) => reportMap.set(r.userId, r));

    return teamMembers.map((member) => {
      const report = reportMap.get(member.id);
      return {
        member: {
          id: member.id,
          name: member.name,
          email: member.email,
          avatarUrl: member.avatarUrl,
          department: member.department,
        },
        status: report ? report.status : 'NOT_STARTED',
        reportId: report ? report.id : null,
        projectName: report?.project?.name || 'N/A',
        submittedAt: report?.submittedAt || null,
        latestComment: report?.latestReviewComment || null,
      };
    });
  }

  /**
   * Workload distribution across projects (number of tasks and total spent hours).
   */
  async getWorkload(weekStartStr?: string) {
    const where: any = {};
    if (weekStartStr) {
      where.weekStart = new Date(weekStartStr);
    }

    const reports = await this.prisma.report.findMany({
      where,
      include: {
        project: true,
        tasks: true,
      },
    });

    const projectMap = new Map<string, { name: string; color: string; taskCount: number; spentHours: number }>();

    reports.forEach((r) => {
      const projName = r.project.name;
      const existing = projectMap.get(projName) || {
        name: projName,
        color: r.project.color || '#3b82f6',
        taskCount: 0,
        spentHours: 0,
      };

      existing.taskCount += r.tasks.length;
      r.tasks.forEach((t) => {
        existing.spentHours += Number(t.spentHours) || 0;
      });

      projectMap.set(projName, existing);
    });

    return Array.from(projectMap.values());
  }

  /**
   * Team-wide time spent by task type (Development, Testing, Meetings, etc.).
   */
  async getTimeDistribution(weekStartStr?: string) {
    const where: any = {};
    if (weekStartStr) {
      where.weekStart = new Date(weekStartStr);
    }

    const hours = await this.prisma.reportHour.findMany({
      where: {
        report: where,
      },
    });

    const categoryMap = new Map<string, number>();
    hours.forEach((h) => {
      const type = h.taskType.trim();
      const current = categoryMap.get(type) || 0;
      categoryMap.set(type, current + Number(h.hours));
    });

    return Array.from(categoryMap.entries()).map(([taskType, hours]) => ({
      taskType,
      hours: Math.round(hours * 10) / 10,
    }));
  }

  /**
   * Recent activity log feed (recent reviews, submissions, and status transitions).
   */
  async getRecentActivity() {
    const comments = await this.prisma.reviewComment.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, name: true, avatarUrl: true } },
        report: {
          include: {
            user: { select: { id: true, name: true } },
            project: { select: { id: true, name: true } },
          },
        },
      },
    });

    return comments.map((c) => ({
      id: c.id,
      action: c.action,
      comment: c.comment,
      createdAt: c.createdAt,
      reviewerName: c.reviewer.name,
      memberName: c.report.user.name,
      reportId: c.report.id,
      projectName: c.report.project.name,
    }));
  }

  /**
   * Bonus feature: Side-by-side section comparison across all team members for a given week.
   * e.g., view all Blockers or all Achievements side-by-side.
   */
  async getSideBySide(section: 'blockers' | 'achievements', weekStartStr?: string) {
    const targetDate = weekStartStr ? new Date(weekStartStr) : new Date();
    const weekStartDate = startOfWeek(targetDate, { weekStartsOn: 1 });

    const reports = await this.prisma.report.findMany({
      where: { weekStart: weekStartDate },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        blockers: true,
        achievements: true,
      },
    });

    return reports.map((r) => ({
      reportId: r.id,
      user: r.user,
      status: r.status,
      items: section === 'blockers' ? r.blockers : r.achievements,
    }));
  }
}
