// import { HttpStatus, Inject } from '@nestjs/common';
// import {
//   Args,
//   Field,
//   Int,
//   ObjectType,
//   Parent,
//   Query,
//   ResolveField,
//   Resolver,
// } from '@nestjs/graphql';
// import { ApiResponse } from '../../common/config/apiresponse';
// import { Cart } from '../../repository/entities/cart.entity';
// import { Users } from '../../repository/entities/users.entity';
// import { CartService } from '../cart/cart.service';
// type User = ApiResponse<Users>;

// @ObjectType()
// export class MutationResult {
//   @Field({ nullable: false })
//   statusCode?: HttpStatus;

//   @Field({ nullable: false })
//   message?: string;

//   @Field({ nullable: true })
//   data?: Users;
// }
// @Resolver((of) => Users)
// export class UsersResolver {
//   constructor(
//     @Inject(UsersService) private usersService: UsersService,
//     @Inject(CartService) private cartService: CartService,
//   ) {}

//   @Query(() => MutationResult)
//   async users(@Args('idUser', { type: () => String }) idUser: string) {
//     return await this.usersService.getUserBydId(idUser);
//   }

//   @ResolveField()
//   async carts(@Parent() user: Users) {
//     const { idUser } = user;
//     return this.cartService.findAll(idUser);
//   }
// }
