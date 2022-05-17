import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../../repository/entities/users.entity';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Request, Response } from 'express';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import { userMock } from '../../../common/mocks/users.mock';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpStatus } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../constants';
import { HashService } from '../hash.service';
import { JwtStrategy } from '../jwt.strategy';
import { LocalStrategy } from '../local.strategy';
import { ApiResponse } from '../../../common/config/apiresponse';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let authRepository: Repository<Users>;
  let module: TestingModule;
  let repositoryMock: MockType<Repository<Users>>;
  let jwtService: JwtService;

  const requestMock = {
    query: {},
  } as unknown as Request;

  const statusResponseMock = {
    send: jest.fn(),
  };

  const responseMock = {
    status: jest.fn((x) => statusResponseMock),
    send: jest.fn((x) => x),
  } as unknown as Response;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '20000s' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            auth: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useFactory: repositoryMockFactory,
        },
        // HashService,
        {
          provide: HashService,
          useValue: {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn((x) => jwtService.sign(x)),
          },
        },
        JwtStrategy,
        LocalStrategy,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    repositoryMock = module.get(getRepositoryToken(Users));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(authRepository).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should return a token dto', async () => {
    const responseUser = {
      token: expect.any(String),
    };
    jest
      .spyOn(authService, 'login')
      .mockImplementation(() => Promise.resolve(responseUser as any));

    const result = await authController.auth({
      idUser: 'string',
      email: 'string',
      userType: 'string',
    });
    // console.log(result);
    expect(result).toEqual(responseUser);
  });

  describe('Pagination', () => {
    it('should return a status 400', async () => {
      // const responseUser = {
      authController.getPagination(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(statusResponseMock.send).toHaveBeenCalledWith('Bad request');
    });

    it('should return a status 200', async () => {
      requestMock.query = {
        count: '2',
        page: '1',
      };
      authController.getPagination(requestMock, responseMock);
      expect(responseMock.send).toHaveBeenCalledWith(200);
    });
    it('should return a status 400 cause doesnt have a count property', async () => {
      // const responseUser = {
      requestMock.query = {
        page: '1',
      };
      authController.getPagination(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(statusResponseMock.send).toBeCalledWith('Bad request');
    });

    it('should return a status 400 cause doesnt have a page property', async () => {
      // const responseUser = {
      requestMock.query = {
        count: '2',
      };
      authController.getPagination(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(statusResponseMock.send).toBeCalledWith('Bad request');
    });
  });

  describe('Authentication', () => {
    it('should login and return a token', async () => {
      const requestMockUser = {
        idUser: 'sss',
        email: 'sss',
        userType: 'sss',
      };

      const tokenReturn: any = {
        token: expect.any(String),
      };
      jest
        .spyOn(authService, 'login')
        .mockImplementation(() =>
          Promise.resolve(tokenReturn as unknown as Promise<{ token: string }>),
        );

      const response = await authController.auth({ user: requestMockUser });
      expect(authService.login).toHaveBeenCalledWith(
        expect.objectContaining({
          idUser: expect.any(String),
          userType: expect.any(String),
          email: expect.any(String),
        }),
      );
      expect(response).toEqual(tokenReturn);
    });
    it('should get bad request when are missing properties on dto of authentication', async () => {
      const requestMockUser = undefined || null;
      const mockResponse: ApiResponse<Users> = {
        message: 'Properties types or properties names are incorrect',
        statusCode: 400,
        data: undefined,
      };

      jest.spyOn(authService, 'login').mockImplementation(() =>
        Promise.resolve(
          mockResponse as unknown as Promise<{
            statusCode: HttpStatus;
            message: string;
            data: unknown;
          }>,
        ),
      );

      const response = await authController.auth({ user: requestMockUser });
      expect(authService.login).toHaveBeenCalledWith(undefined || null);
      expect(response).toEqual(mockResponse);
    });

    it('should create a user', async () => {
      const mockResponse: ApiResponse<Users> = {
        message: 'User created successfully',
        statusCode: 201,
        data: undefined,
      };
      jest
        .spyOn(authService, 'register')
        .mockImplementation(() =>
          Promise.resolve(
            mockResponse as unknown as Promise<ApiResponse<Users>>,
          ),
        );
      const response = await authController.register(userMock);
      expect(response).toEqual(mockResponse);
    });
    it('should retrieve the user of body request', async () => {
      const response = await authController.getProfile({
        user: userMock,
      });
      expect(response).toEqual(userMock);
    });

    it('should not create a user if user exist', async () => {
      const mockResponse: ApiResponse<Users> = {
        message: 'User already exists',
        statusCode: 409,
        data: undefined,
      };
      jest
        .spyOn(authService, 'register')
        .mockImplementation(() =>
          Promise.resolve(
            mockResponse as unknown as Promise<ApiResponse<Users>>,
          ),
        );
      const response = await authController.register(userMock);
      expect(response).toEqual(mockResponse);
    });
  });
});
// const requestMockUser: any = {
//   email: '',
//   age: '25',
//   password: '',
//   userType: '',
//   lastname: '',
//   name: '',
//   username: '',
// };
