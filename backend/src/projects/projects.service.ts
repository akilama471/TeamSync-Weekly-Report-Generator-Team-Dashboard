import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    const existing = await this.prisma.project.findUnique({
      where: { name: dto.name.trim() },
    });

    if (existing) {
      throw new ConflictException(`Project with name "${dto.name}" already exists`);
    }

    return this.prisma.project.create({
      data: {
        name: dto.name.trim(),
        code: dto.code ? dto.code.trim().toUpperCase() : undefined,
        description: dto.description,
        color: dto.color || '#3b82f6',
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        _count: {
          select: { reports: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        reports: {
          take: 10,
          orderBy: { weekStart: 'desc' },
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
        _count: {
          select: { reports: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        code: dto.code ? dto.code.trim().toUpperCase() : undefined,
      },
    });
  }

  async remove(id: number) {
    const project = await this.findOne(id);

    // If reports exist, deactivate instead of hard delete to preserve history
    const reportCount = await this.prisma.report.count({ where: { projectId: id } });
    if (reportCount > 0) {
      await this.prisma.project.update({
        where: { id },
        data: { isActive: false },
      });
      return { message: `Project has ${reportCount} associated reports. Marked as inactive instead of deleting.` };
    }

    await this.prisma.project.delete({ where: { id } });
    return { message: `Project "${project.name}" deleted successfully` };
  }
}
