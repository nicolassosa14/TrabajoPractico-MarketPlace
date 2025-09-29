// src/login/strategy/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // podes customizar handleRequest si querés
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
