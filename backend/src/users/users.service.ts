import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * List all users with their roles (used in manager dashboard filters and admin user management).
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        department: true,
        jobTitle: true,
        roleId: true,
        role: { select: { id: true, name: true } },
        createdAt: true,
        _count: {
          select: { reports: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Get detailed profile of a team member, including compliance stats and report history.
   * Required for page: Team member profile page (/manager/users/:id).
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        reports: {
          orderBy: { weekStart: 'desc' },
          include: {
            project: true,
            _count: {
              select: { tasks: true, blockers: true, achievements: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { passwordHash: _, ...safeUser } = user;

    // Calculate personal report metrics
    const totalReports = user.reports.length;
    const approvedCount = user.reports.filter((r) => r.status === 'APPROVED').length;
    const needsCorrectionCount = user.reports.filter((r) => r.status === 'NEEDS_CORRECTION').length;
    const submittedCount = user.reports.filter((r) => r.status === 'SUBMITTED').length;

    const complianceRate = totalReports > 0 ? Math.round((approvedCount / totalReports) * 100) : 0;

    return {
      ...safeUser,
      stats: {
        totalReports,
        approvedCount,
        needsCorrectionCount,
        submittedCount,
        complianceRate,
      },
    };
  }

  /**
   * Update user details or role assignment (Admin only for role changes).
   */
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
      include: { role: true },
    });

    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }

  /**
   * Remove user account (Admin only).
   */
  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: `User ${user.name} removed successfully` };
  }

  /**
   * List available system roles for user assignment.
   */
  async getRoles() {
    return this.prisma.role.findMany();
  }
}
