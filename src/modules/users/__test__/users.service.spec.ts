import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../../common/config/apiresponse';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import { userMock } from '../../../common/mocks/users.mock';
import { Users } from '../../../repository/entities/users.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let repositoryMock: MockType<Repository<Users>>;
  let authRepository: Repository<Users>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            getUserBydId: jest.fn(),
            deleteUser: jest.fn(),
            deleteAllUsers: jest.fn(),
          },
        },
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    repositoryMock = module.get(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(authRepository).toBeDefined();
    expect(repositoryMock).toBeDefined();
  });

  it('should return an array of users', async () => {
    const users: Users[] = [userMock, userMock];
    const mockResponse: ApiResponse<Users[]> = {
      message: 'Users retrieved successfully',
      data: users,
      statusCode: 200,
    };
    repositoryMock.find.mockReturnValue(users);
    const result = await usersService.getUsers();
    expect(result).toEqual(mockResponse);
  });
  it('should return a user by Id', async () => {
    const mockResponse: ApiResponse<Users> = {
      message: 'User retrieved successfully',
      data: userMock,
      statusCode: 200,
    };
    repositoryMock.findOne.mockReturnValue(userMock);
    const result = await usersService.getUserBydId(userMock.idUser);
    expect(result).toEqual(mockResponse);
  });
  it('should delete a user', async () => {
    const mockResponse: ApiResponse<Users> = {
      message: 'User deleted successfully',
      data: undefined,
      statusCode: 200,
    };
    repositoryMock.findOne.mockReturnValue(userMock);
    repositoryMock.delete.mockReturnValue(userMock);
    const result = await usersService.deleteUser(userMock.idUser);
    expect(result).toEqual(mockResponse);
  });
  it('should throw error if user not found when trying to delete', async () => {
    const mockResponse: ApiResponse<Users> = {
      message: 'User not found',
      data: undefined,
      statusCode: 404,
    };
    repositoryMock.findOne.mockReturnValue(null);
    const result = await usersService.deleteUser('wrongId');
    expect(result).toEqual(mockResponse);
  });
  it('should delete all users', async () => {
    const mockResponse: ApiResponse<Users> = {
      message: 'Users deleted successfully',
      data: undefined,
      statusCode: 200,
    };
    repositoryMock.delete.mockReturnValue({});
    const result = await usersService.deleteAllUsers();
    expect(result).toEqual(mockResponse);
  });
});
