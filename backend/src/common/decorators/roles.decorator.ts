import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../constants/roles.constant';

export const ROLES_KEY = 'roles';

/**
 * Custom decorator to declare roles allowed on a given endpoint.
 * Example: @Roles(RoleType.MANAGER, RoleType.ADMIN)
 */
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
