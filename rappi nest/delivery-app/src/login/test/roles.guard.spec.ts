import { RolesGuard } from '../decorators/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function createContext(user?: any, roles?: string[]): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  it('should allow access if no roles required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const can = guard.canActivate(createContext());
    expect(can).toBe(true);
  });

  it('should deny access if no user', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const can = guard.canActivate(createContext());
    expect(can).toBe(false);
  });

  it('should allow access if role matches', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const can = guard.canActivate(createContext({ role: 'ADMIN' }));
    expect(can).toBe(true);
  });

  it('should be case insensitive', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const can = guard.canActivate(createContext({ role: 'ADMIN' }));
    expect(can).toBe(true);
  });

  it('should deny access if role does not match', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    const can = guard.canActivate(createContext({ role: 'CLIENT' }));
    expect(can).toBe(false);
  });
});
