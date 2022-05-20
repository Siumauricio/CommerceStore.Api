import { Inject } from '@nestjs/common';
import {
  Args,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  QueryResponse,
  QueryResponseArray,
} from '../../common/config/apiresponse';
import { GqlAuth } from '../../decorators/gql.auth.decorator';
import { Users } from '../../repository/entities/users.entity';
import { Role } from '../auth/roles.enum';
import { CartService } from '../cart/cart.service';
import { UsersService } from './users.service';

@ObjectType()
export class UsersResponse extends QueryResponse(Users) {} // Abstract class to cast generic to entity

@ObjectType()
export class UsersResponseArray extends QueryResponseArray(Users) {} // Abstract class to cast generic to entity

@Resolver((of) => Users)
export class UsersResolver {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(CartService) private cartService: CartService,
  ) {}

  @Query(() => UsersResponse)
  async userById(@Args('idUser', { type: () => String }) idUser: string) {
    return await this.usersService.getUserBydId(idUser);
  }

  // @GqlAuth(Role.Member)
  @Query(() => UsersResponseArray)
  async allUsers() {
    return await this.usersService.getUsers();
  }

  @ResolveField()
  async carts(@Parent() user: Users) {
    const { idUser } = user;
    return await this.cartService.findAll(idUser);
  }
}
