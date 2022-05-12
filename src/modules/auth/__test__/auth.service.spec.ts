import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { HashService } from '../hash.service';
import { JwtStrategy } from '../jwt.strategy';
import { LocalStrategy } from '../local.strategy';
import { Users } from '../../../repository/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { async } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: Repository<Users>;

  const AUTH_REPOSITORY_TOKEN = getRepositoryToken(Users);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          provide: AUTH_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
          },
        },
        // HashService,
        // JwtStrategy,
        // LocalStrategy,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<Users>>(AUTH_REPOSITORY_TOKEN);
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });
  it('authRepository should be defined', async () => {
    expect(authRepository).toBeDefined();
  });

  describe('registerUser ', () => {
    it('should create a new user in the database', async () => {
      const user = {
        name: 'string',
        lastname: 'string',
        username: 'string',
        age: 0,
        email: 'string',
        userType: 'string',
        password: 'string',
      };
      await authService.register(user);
    });
    it('should call authRepository.register with the correct params', async () => {
      const user = {
        age: 0,
        email: 'string',
        idUser: 'string',
        lastname: 'string',
        name: 'string',
        password: 'string',
        userType: 'string',
        username: 'string',
      };
      await authService.register(user);
      expect(authRepository.create).toHaveBeenCalledWith(user);
    });
  });
});
