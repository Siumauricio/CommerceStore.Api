import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, instanceToPlain, plainToClass } from 'class-transformer';
import { randomUUID } from 'crypto';
import { Users } from 'src/repository/entities/users.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}
  createUser = async (user: UserDto) => {
    const result = UsersService.toModel(user);
    result.idUser = randomUUID();
    result.userType = 'member';
    return await this.usersRepository.save(result);
  };
  static toModel(userDto: UserDto): Users {
    const data = instanceToPlain(userDto);
    return plainToClass(Users, data);
  }
}
