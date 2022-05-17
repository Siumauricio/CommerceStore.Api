import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { HashService } from '../hash.service';
import { Users } from '../../../repository/entities/users.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ApiResponse } from '../../../common/config/apiresponse';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../constants';
import { AuthDto, AuthRegisterDto } from '../auth.dto';
import { userMock } from '../../../common/mocks/users.mock';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';

describe('AuthService', () => {
  let repositoryMock: MockType<Repository<Users>>;
  let authService: AuthService;
  let authRepository: Repository<Users>;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '20000s' },
        }),
      ],
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
        AuthService,
        {
          provide: getRepositoryToken(Users),
          useFactory: repositoryMockFactory,
        },
        HashService,
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
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    repositoryMock = module.get(getRepositoryToken(Users));
    authRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });
  it('authRepository should be defined', async () => {
    expect(authRepository).toBeDefined();
  });

  it('should return a undefined when send a wrong types or empty props on login', async () => {
    const dto = new Users();
    const mockResponse: ApiResponse<Users> = {
      message: expect.any(String),
      statusCode: expect.any(Number),
      data: undefined,
    };
    let result = await authService.login(dto);
    expect(result).toEqual(mockResponse);
  });

  it('should return a token object if all properties are filled ', async () => {
    const dto = new Users();
    const user: any = {
      email: 'string',
      userType: 'string',
      idUser: 'string',
    };
    let result = await authService.login(user);
    expect(result).toEqual({ token: expect.any(String) });
  });

  it('should create a user', async () => {
    const dto = new AuthRegisterDto();
    const MockResponse: ApiResponse<Users> = {
      message: expect.any(String),
      statusCode: expect.any(Number),
      data: undefined,
    };
    const user: AuthRegisterDto = {
      email: 'string',
      userType: 'string',
      lastname: 'string',
      name: 'string',
      password: 'string',
      username: 'string',
      age: 0,
    };
    let result = await authService.register(user);
    expect(result).toEqual(MockResponse);
  });

  it('should login sucessfuly', async () => {
    const MockResponse: ApiResponse<Users> = {
      message: 'User authenticated successfully',
      statusCode: 200,
      data: userMock,
    };
    const payloadUser: AuthDto = {
      email: 'string',
      password: 'string',
    };
    // const hola = repositoryMock.save.mockReturnValue(user2);
    // console.log(hola());
    repositoryMock.findOne.mockReturnValue(userMock);
    let result = await authService.auth(payloadUser);
    expect(result).toEqual(MockResponse);
  });
});
