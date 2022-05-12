import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { Users } from '../../../repository/entities/users.entity';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constants';
import { JwtStrategy } from '../jwt.strategy';
import { LocalStrategy } from '../local.strategy';
import { AuthDto } from '../auth.dto';
import { HashService } from '../hash.service';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let module: TestingModule;
  const mockUsersService = {
    login: jest.fn((dto) => {
      return {
        token: 'token',
      };
    }),
    register: jest.fn((dto) => {
      return {
        statusCode: HttpStatus,
        message: expect.any(String),
        data: expect.any(Users),
      };
    }),
  };
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        HashService,
        LocalStrategy,
        JwtStrategy,
        // {
        //   provide: getRepositoryToken(Users),
        //   useValue: USER
        // },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockUsersService)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // afterAll(async () => {
  //   module.close();
  // });
  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should return a token dto', async () => {
    const responseUser = {
      token: 2,
    };
    jest
      .spyOn(authService, 'login')
      .mockImplementation(() => Promise.resolve(responseUser as any));

    const result = await authController.auth({
      idUser: 'string',
      email: 'string',
      userType: 'string',
    });
    expect(result).toEqual(responseUser);
  });

  it('should register a user', async () => {
    const responseUser = {
      name: 'string',
      lastname: 'string',
      username: 'string',
      age: 2,
      email: 'string',
      userType: 'string',
      password: 'string',
    };
    jest
      .spyOn(authService, 'register')
      .mockImplementation(() => Promise.resolve(responseUser as any));
    const result = await authController.register({
      name: 'string',
      lastname: 'string',
      username: 'string',
      age: 2,
      email: 'string',
      userType: 'string',
      password: 'string',
    });
    expect(result).toEqual(responseUser);
  });
  // it('should be return a token', async () => {
  // const result: AuthDto = {
  //   email: 'string2',
  //   password: 'string',
  // };
  //   // expect(await authController.auth(result)).toEqual({
  //   //   token: expect.any(String),
  //   // });
  //   // expect(mockUsersService.login).toHaveBeenCalledWith({
  //   //   email: 'string',
  //   //   idUser: 'string',
  //   //   userType: 'string',
  //   // });
  // });
  // it('should return a token', async () => {
  // const result: AuthDto = {
  //   email: 'string',
  //   password: 'string',
  // };
  //   // jest.spyOn(authService, 'findAll').mockImplementation(() => result);

  //   // expect(await authController.auth(result)).toBe(result);
  // });
});
