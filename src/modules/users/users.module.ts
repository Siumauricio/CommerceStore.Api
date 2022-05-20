import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from '../../repository/entities/users.entity';
import { UsersResolver } from './users.resolver';
import { CartModule } from '../cart/cart.module';
import { CartService } from '../cart/cart.service';

@Module({
  imports: [CartModule, TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
