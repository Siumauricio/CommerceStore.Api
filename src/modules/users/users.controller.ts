import { Controller, Get, Param, Delete } from '@nestjs/common';
import { Auth } from '../../decorators/auth.decorator';
import { Role } from '../auth/roles.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @Auth()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/:id')
  getUser(@Param('id') idUser: string) {
    return this.usersService.getUserBydId(idUser);
  }

  @Delete('/:id')
  deleteUser(@Param('id') idUser: string) {
    return this.usersService.deleteUser(idUser);
  }

  @Delete()
  deleteAllUsers() {
    return this.usersService.deleteAllUsers();
  }
}
