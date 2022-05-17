import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from '../../common/config/apiresponse';
import { Users } from '../../repository/entities/users.entity';
import { Repository } from 'typeorm';
import { AuthDto, AuthRegisterDto } from './auth.dto';
import { randomUUID } from 'crypto';
import { HashService } from './hash.service';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  auth = async (authDto: AuthDto): Promise<ApiResponse<Users>> => {
    const result = await this.usersRepository.findOne({
      where: { email: authDto.email.toLowerCase() },
    });
    if (result) {
      const isValid = await bcrypt.compare(authDto.password, result.password);
      return isValid
        ? ApiResponse(HttpStatus.OK, 'User authenticated successfully', result)
        : ApiResponse(HttpStatus.UNAUTHORIZED, 'Invalid password');
    }
    return ApiResponse(HttpStatus.UNAUTHORIZED, 'User not found');
  };

  login = async (user: Users) => {
    console.log(user);
    if (!user || !user.idUser || !user.email || !user.userType) {
      return ApiResponse(
        HttpStatus.BAD_REQUEST,
        'Properties types or properties names are incorrect',
      );
    }
    const payload = {
      id: user.idUser,
      email: user.email,
      userType: user.userType,
    };
    const token = this.jwtService.sign(payload);
    // console.log(token);
    return { token: token };
  };

  register = async (user: AuthRegisterDto): Promise<ApiResponse<Users>> => {
    const result = await this.usersRepository.findOne({
      where: { email: user.email.toLowerCase() },
    });
    if (!result) {
      const userEntity = AuthService.dtoToEntity(user);
      userEntity.password = await bcrypt.hash(user.password, 10);
      userEntity.idUser = randomUUID();
      await this.usersRepository.save(userEntity);
      return ApiResponse(HttpStatus.CREATED, 'User created successfully');
    }
    return ApiResponse(HttpStatus.CONFLICT, 'User already exists');
  };

  static dtoToEntity(userDto: AuthRegisterDto): Users {
    const data = instanceToPlain(userDto);
    return plainToClass(Users, data);
  }
}
