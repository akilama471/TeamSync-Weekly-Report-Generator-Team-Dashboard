import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RoleType } from '../common/constants/roles.constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user with secure password hashing and default role assignment.
   */
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Default to TEAM_MEMBER role if roleId not provided
    let roleId = dto.roleId;
    if (!roleId) {
      const defaultRole = await this.prisma.role.findUnique({
        where: { name: RoleType.TEAM_MEMBER },
      });
      roleId = defaultRole ? defaultRole.id : 1;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        name: dto.name,
        department: dto.department || 'Engineering',
        jobTitle: dto.jobTitle || 'Software Engineer',
        roleId,
      },
      include: { role: true },
    });

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        details: { email: user.email, role: user.role.name },
      },
    });

    const token = this.generateToken(user);

    const { passwordHash: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken: token,
    };
  }

  /**
   * Authenticate user credentials and return JWT token.
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        details: { timestamp: new Date().toISOString() },
      },
    });

    const token = this.generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken: token,
    };
  }

  /**
   * Helper to sign JWT payload
   */
  private generateToken(user: { id: number; email: string; role: { name: string } }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Return profile of currently authenticated user.
   */
  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
