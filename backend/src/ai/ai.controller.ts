import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../common/constants/roles.constant';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.MANAGER, RoleType.ADMIN)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: { message: string; weekStart?: string }) {
    return this.aiService.chat(body.message, body.weekStart);
  }

  @Get('summary')
  async getWeeklySummary(@Query('weekStart') weekStart?: string) {
    return this.aiService.getWeeklySummary(weekStart);
  }
}
