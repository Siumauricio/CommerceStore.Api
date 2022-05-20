import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { GqlAuthGuard } from '../modules/auth/gql-auth-guard';
import { Role } from '../modules/auth/roles.enum';
import { Roles } from './roles.decorator';

export function GqlAuth(...roles: Role[]) {
  return applyDecorators(Roles(...roles), UseGuards(GqlAuthGuard, RolesGuard));
}
