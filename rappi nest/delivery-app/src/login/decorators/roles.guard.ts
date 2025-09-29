// src/login/decorators/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!requiredRoles) return true; // no roles required

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as any;
    if (!user) return false;
    const userRole = (user.role || '').toLowerCase();
    return requiredRoles.some(r => r.toLowerCase() === userRole);
  }
}
