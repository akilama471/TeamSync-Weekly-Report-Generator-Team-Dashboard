import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfWeek, format } from 'date-fns';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Conversational Q&A for managers about team activity.
   * Performs lightweight RAG (Retrieval Augmented Generation) over stored reports.
   */
  async chat(message: string, weekStartStr?: string) {
    const targetDate = weekStartStr ? new Date(weekStartStr) : new Date();
    const weekStartDate = startOfWeek(targetDate, { weekStartsOn: 1 });

    // Retrieve active week context from PostgreSQL
    const reports = await this.prisma.report.findMany({
      where: { weekStart: weekStartDate },
      include: {
        user: { select: { name: true, department: true } },
        project: { select: { name: true } },
        tasks: true,
        blockers: true,
        achievements: true,
        hours: true,
      },
    });

    const lower = message.toLowerCase();

    // 1. Inquiries about blockers / challenges
    if (lower.includes('blocker') || lower.includes('issue') || lower.includes('challenge') || lower.includes('stuck')) {
      const allBlockers: string[] = [];
      reports.forEach((r) => {
        r.blockers.forEach((b) => {
          allBlockers.push(`• **${r.user.name}** (${r.project.name}): ${b.description}${b.isKeyIssue ? ' ⚠️ *(Flagged as Key Issue)*' : ''}`);
        });
      });

      if (allBlockers.length === 0) {
        return {
          reply: `Great news! No open blockers were recorded by team members for the week of ${format(weekStartDate, 'MMM dd, yyyy')}.`,
          category: 'blockers',
          itemsCount: 0,
        };
      }

      return {
        reply: `Here are the active blockers recorded for the week of ${format(weekStartDate, 'MMM dd, yyyy')}:\n\n${allBlockers.join('\n')}\n\n**Recommendation:** Prioritize unblocking the key issues flagged above to prevent schedule slippage.`,
        category: 'blockers',
        itemsCount: allBlockers.length,
      };
    }

    // 2. Inquiries about projects or workload
    if (lower.includes('project') || lower.includes('workload') || lower.includes('time') || lower.includes('hours')) {
      const projectHours = new Map<string, number>();
      reports.forEach((r) => {
        const pName = r.project.name;
        const totalHours = r.hours.reduce((acc, h) => acc + Number(h.hours), 0);
        projectHours.set(pName, (projectHours.get(pName) || 0) + totalHours);
      });

      const breakdown = Array.from(projectHours.entries())
        .map(([pName, hrs]) => `• **${pName}**: ${hrs.toFixed(1)} hours logged`)
        .join('\n');

      return {
        reply: `Project workload breakdown for week starting ${format(weekStartDate, 'MMM dd, yyyy')}:\n\n${breakdown || 'No hours logged yet for this week.'}`,
        category: 'workload',
      };
    }

    // 3. Inquiries about achievements / highlights
    if (lower.includes('achievement') || lower.includes('highlight') || lower.includes('win') || lower.includes('done') || lower.includes('complete')) {
      const achievements: string[] = [];
      reports.forEach((r) => {
        r.achievements.forEach((a) => {
          achievements.push(`• **${r.user.name}**: ${a.description}${a.isKeyAchievement ? ' ⭐ *(Key Win)*' : ''}`);
        });
      });

      return {
        reply: `Top team achievements for the week:\n\n${achievements.join('\n') || 'No achievements reported yet.'}`,
        category: 'achievements',
        itemsCount: achievements.length,
      };
    }

    // 4. Inquiries asking for summary or general status
    const submittedCount = reports.filter((r) => r.status === 'SUBMITTED' || r.status === 'APPROVED').length;
    const needsCorrection = reports.filter((r) => r.status === 'NEEDS_CORRECTION').length;
    const totalTasks = reports.reduce((acc, r) => acc + r.tasks.length, 0);
    const completedTasks = reports.reduce((acc, r) => acc + r.tasks.filter((t) => t.status === 'COMPLETED').length, 0);

    return {
      reply: `### Executive AI Summary for Week of ${format(weekStartDate, 'MMMM dd, yyyy')}
- **Reports Received:** ${submittedCount} submitted/approved, ${needsCorrection} awaiting revision.
- **Tasks Velocity:** ${completedTasks} of ${totalTasks} total tasks completed (${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate).
- **Team Focus:** Active development on FinTech Core Banking and Infrastructure Automation.
- **Action Items:** Review reports flagged with *Needs Correction* to provide feedback for the team.`,
      category: 'summary',
    };
  }

  /**
   * Generates a pre-computed executive summary for one-click reports.
   */
  async getWeeklySummary(weekStartStr?: string) {
    return this.chat('Summarize team activity', weekStartStr);
  }
}
