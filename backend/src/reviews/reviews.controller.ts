import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { RequestCorrectionDto } from './dto/request-correction.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../common/constants/roles.constant';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post(':id/approve')
  @Roles(RoleType.MANAGER, RoleType.ADMIN)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') reviewerId: number,
    @Body() dto: ApproveReportDto,
  ) {
    return this.reviewsService.approve(id, reviewerId, dto);
  }

  @Post(':id/request-correction')
  @Roles(RoleType.MANAGER, RoleType.ADMIN)
  async requestCorrection(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') reviewerId: number,
    @Body() dto: RequestCorrectionDto,
  ) {
    return this.reviewsService.requestCorrection(id, reviewerId, dto);
  }

  @Get(':id/versions')
  @Roles(RoleType.MANAGER, RoleType.ADMIN, RoleType.TEAM_MEMBER)
  async getVersions(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getVersions(id);
  }
}
