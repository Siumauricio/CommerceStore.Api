import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../modules/auth/roles.enum';
import { Users } from '../repository/entities/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const hasRequiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!hasRequiredRoles) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    if (ctx.getType() === 'graphql') {
      const user: Users = ctx.getContext().req.user;
      return hasRequiredRoles.some((role) => user.userType.includes(role));
    }

    const { user: contextUser } = context.switchToHttp().getRequest();
    const user: Users = contextUser;
    return hasRequiredRoles.some((role) => user.userType.includes(role));
  }
}
