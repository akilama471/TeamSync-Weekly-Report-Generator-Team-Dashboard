import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleType } from '../constants/roles.constant';

/**
 * RolesGuard enforces role-based access control (RBAC).
 * Compares the user's role with roles required on the handler/class.
 * ADMIN has superset privileges over MANAGER and TEAM_MEMBER.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If route does not specify @Roles, it is accessible to any authenticated user
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: User role not defined');
    }

    const userRole = user.role.name;

    // ADMIN has full access across all endpoints
    if (userRole === RoleType.ADMIN) {
      return true;
    }

    // MANAGER has access to MANAGER and TEAM_MEMBER endpoints
    if (userRole === RoleType.MANAGER && (requiredRoles.includes(RoleType.MANAGER) || requiredRoles.includes(RoleType.TEAM_MEMBER))) {
      return true;
    }

    // Exact role match check
    const hasRole = requiredRoles.some((role) => role === userRole);
    if (!hasRole) {
      throw new ForbiddenException(`Access denied: Requires one of roles [${requiredRoles.join(', ')}]. Current role: ${userRole}`);
    }

    return true;
  }
}
