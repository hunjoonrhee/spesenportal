import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '../domain/types.js';

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): User => {
  return ctx.switchToHttp().getRequest<{ user: User }>().user;
});
