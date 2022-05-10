import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from 'src/common/config/apiresponse';
import { Users } from 'src/repository/entities/users.entity';
import { Repository } from 'typeorm';
import { AuthDto, AuthRegisterDto } from './auth.dto';
import { randomUUID } from 'crypto';
import { HashService } from './hash.service';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private crypt: HashService,
    private jwtService: JwtService,
  ) {}

  auth = async (authDto: AuthDto): Promise<ApiResponse<Users>> => {
    const result = await this.usersRepository.findOne({
      where: { email: authDto.email.toLowerCase() },
    });
    if (result) {
      const isValid = await this.crypt.comparePassword(
        authDto.password,
        result.password,
      );
      return isValid
        ? ApiResponse(HttpStatus.OK, 'User authenticated successfully', result)
        : ApiResponse(HttpStatus.UNAUTHORIZED, 'Invalid password');
    }
    return ApiResponse(HttpStatus.UNAUTHORIZED, 'User not found');
  };

  login = async (user: Users) => {
    const payload = {
      id: user.idUser,
      email: user.email,
      userType: user.userType,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  };

  register = async (user: AuthRegisterDto): Promise<ApiResponse<Users>> => {
    const result = await this.usersRepository.findOne({
      where: { email: user.email.toLowerCase() },
    });
    if (!result) {
      const userEntity = AuthService.dtoToEntity(user);
      userEntity.password = await this.crypt.hashPassword(user.password);
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
