import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { DataStoreService } from '../data/data-store.service.js';
import { IS_PUBLIC } from './public.decorator.js';

export const DEMO_USER_HEADER = 'x-demo-user';

/**
 * Demo-Authentifizierung (siehe ADR-0004): Der Client schickt die Nutzer-ID im Header X-Demo-User.
 * Wird durch SSO ersetzt (Spike EXP-75).
 */
@Injectable()
export class DemoUserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly store: DataStoreService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request & { user?: unknown }>();
    const userId = req.header(DEMO_USER_HEADER);
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new UnauthorizedException('Unbekannter oder fehlender Demo-Nutzer (Header X-Demo-User)');
    req.user = user;
    return true;
  }
}
