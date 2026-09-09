import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../common/constants/roles.constant';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.MANAGER, RoleType.ADMIN)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(@Query('weekStart') weekStart?: string) {
    return this.dashboardService.getSummary(weekStart);
  }

  @Get('task-trends')
  async getTaskTrends() {
    return this.dashboardService.getTaskTrends();
  }

  @Get('member-status')
  async getMemberStatus(@Query('weekStart') weekStart?: string) {
    return this.dashboardService.getMemberStatus(weekStart);
  }

  @Get('workload')
  async getWorkload(@Query('weekStart') weekStart?: string) {
    return this.dashboardService.getWorkload(weekStart);
  }

  @Get('time-distribution')
  async getTimeDistribution(@Query('weekStart') weekStart?: string) {
    return this.dashboardService.getTimeDistribution(weekStart);
  }

  @Get('activity')
  async getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }

  @Get('side-by-side')
  async getSideBySide(
    @Query('section') section: 'blockers' | 'achievements' = 'blockers',
    @Query('weekStart') weekStart?: string,
  ) {
    return this.dashboardService.getSideBySide(section, weekStart);
  }
}
