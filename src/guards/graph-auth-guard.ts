import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../modules/auth/roles.enum';

@Injectable()
export class GraphAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  validateRequest(request) {
    return true;
  }
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.switchToHttp().getRequest();
    return this.validateRequest(request);
    // console.log(ctx.getContext().req);
    // const user = ctx.switchToHttp().getRequest();
    // console.log(context.switchToHttp().getRequest());

    // return true;
  }
}
