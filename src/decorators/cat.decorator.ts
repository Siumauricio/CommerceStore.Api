import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const Cats = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const cat = request.body;
      return data ? cat && cat[data] : cat;
    } catch (error) {
      throw new ForbiddenException();
    }
  },
);
// export const AuthUser = createParamDecorator(
//   (data: string, ctx: ExecutionContext) => {
//     try {
//       const request = ctx.switchToHttp().getRequest();
//       const user = request.body;
//       return data ? user?.[data] : user;
//     } catch (error) {
//       throw new ForbiddenException();
//     }
//   },
// );
