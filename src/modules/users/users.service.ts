import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { randomUUID } from 'crypto';
import { ApiResponse } from '../../common/config/apiresponse';
import { Users } from '../../repository/entities/users.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  getUsers = async (): Promise<ApiResponse<Users[]>> => {
    const result = await this.usersRepository.find();
    return ApiResponse(HttpStatus.OK, 'Users retrieved successfully', result);
  };

  getUserBydId = async (idUser: string): Promise<ApiResponse<Users>> => {
    const result = await this.usersRepository.findOne({
      where: { idUser },
    });
    if (result) {
      return ApiResponse(HttpStatus.OK, 'User retrieved successfully', result);
    }
    return ApiResponse(HttpStatus.NOT_FOUND, 'User not found');
  };

  deleteUser = async (idUser: string): Promise<ApiResponse<Users>> => {
    const result = await this.usersRepository.findOne({
      where: { idUser },
    });
    if (result) {
      await this.usersRepository.delete({ idUser });
      return ApiResponse(HttpStatus.OK, 'User deleted successfully');
    }
    return ApiResponse(HttpStatus.NOT_FOUND, 'User not found');
  };
  deleteAllUsers = async (): Promise<ApiResponse<Users>> => {
    await this.usersRepository.delete({});
    return ApiResponse(HttpStatus.OK, 'Users deleted successfully');
  };

  static dtoToEntity(userDto: UserDto): Users {
    const data = instanceToPlain(userDto);
    return plainToClass(Users, data);
  }
}
