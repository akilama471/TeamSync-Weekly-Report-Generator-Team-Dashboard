import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom parameter decorator to extract the authenticated user object from the HTTP request.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
