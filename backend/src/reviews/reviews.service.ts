import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestCorrectionDto } from './dto/request-correction.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { ReportStatus, ReviewAction } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Manager approves a submitted report.
   * Transitions SUBMITTED -> APPROVED.
   */
  async approve(reportId: number, reviewerId: number, dto: ApproveReportDto) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        versions: { orderBy: { versionNumber: 'desc' }, take: 1 },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${reportId} not found`);
    }

    if (report.status !== ReportStatus.SUBMITTED) {
      throw new BadRequestException(
        `Cannot approve report. Only reports in SUBMITTED status can be approved. Current status: ${report.status}`,
      );
    }

    const latestVersion = report.versions.length > 0 ? report.versions[0] : null;

    const [updatedReport] = await this.prisma.$transaction([
      this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.APPROVED,
          approvedAt: new Date(),
        },
      }),
      this.prisma.reviewComment.create({
        data: {
          reportId,
          reviewerId,
          versionId: latestVersion ? latestVersion.id : undefined,
          action: ReviewAction.APPROVED,
          comment: dto.comment || 'Report approved by manager without changes.',
        },
      }),
      this.prisma.auditLog.create({
        data: {
          userId: reviewerId,
          action: 'REPORT_APPROVED',
          details: { reportId },
        },
      }),
    ]);

    return updatedReport;
  }

  /**
   * Manager requests changes on a submitted report.
   * Transitions SUBMITTED -> NEEDS_CORRECTION.
   * Requires a general comment explaining what needs correction.
   */
  async requestCorrection(reportId: number, reviewerId: number, dto: RequestCorrectionDto) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        versions: { orderBy: { versionNumber: 'desc' }, take: 1 },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${reportId} not found`);
    }

    if (report.status !== ReportStatus.SUBMITTED) {
      throw new BadRequestException(
        `Cannot request changes on report. Only reports in SUBMITTED status can be sent back for correction. Current status: ${report.status}`,
      );
    }

    const latestVersion = report.versions.length > 0 ? report.versions[0] : null;

    const [updatedReport] = await this.prisma.$transaction([
      this.prisma.report.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.NEEDS_CORRECTION,
          latestReviewComment: dto.comment,
        },
      }),
      this.prisma.reviewComment.create({
        data: {
          reportId,
          reviewerId,
          versionId: latestVersion ? latestVersion.id : undefined,
          action: ReviewAction.REQUEST_CHANGES,
          comment: dto.comment,
        },
      }),
      this.prisma.auditLog.create({
        data: {
          userId: reviewerId,
          action: 'REPORT_CORRECTION_REQUESTED',
          details: { reportId, comment: dto.comment },
        },
      }),
    ]);

    return updatedReport;
  }

  /**
   * View full version history and reviewer comments for on-demand comparison.
   * Fulfills assignment bonus requirement for version history audit.
   */
  async getVersions(reportId: number) {
    const versions = await this.prisma.reportVersion.findMany({
      where: { reportId },
      orderBy: { versionNumber: 'desc' },
      include: {
        submittedBy: { select: { id: true, name: true, email: true } },
        comments: {
          include: { reviewer: { select: { id: true, name: true } } },
        },
      },
    });

    return versions;
  }
}
