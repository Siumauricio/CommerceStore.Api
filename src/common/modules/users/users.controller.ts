import { Body, Controller, Post } from '@nestjs/common';
import { Users } from 'src/repository/entities/users.entity';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() user: UserDto) {
    // console.log(user);
    return this.usersService.createUser(user);
  }
}
