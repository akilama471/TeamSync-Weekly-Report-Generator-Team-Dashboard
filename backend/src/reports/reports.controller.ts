import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportQueryDto } from './dto/report-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  async create(@CurrentUser() currentUser: any, @Body() dto: CreateReportDto) {
    return this.reportsService.create(currentUser.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() currentUser: any, @Query() query: ReportQueryDto) {
    return this.reportsService.findAll(currentUser, query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: any) {
    return this.reportsService.findOne(id, currentUser);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
    @Body() dto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, currentUser, dto);
  }

  @Post(':id/submit')
  async submit(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: any) {
    return this.reportsService.submit(id, currentUser);
  }
}
