import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../common/constants/roles.constant';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @Roles(RoleType.MANAGER, RoleType.ADMIN)
  async create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleType.MANAGER, RoleType.ADMIN)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RoleType.MANAGER, RoleType.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
