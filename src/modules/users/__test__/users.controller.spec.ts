import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../../common/config/apiresponse';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import { userMock } from '../../../common/mocks/users.mock';
import { Users } from '../../../repository/entities/users.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let repositoryMock: MockType<Repository<Users>>;
  let usersService: UsersService;
  let userRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
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
        // UsersService,
        {
          provide: getRepositoryToken(Users),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    usersController = module.get<UsersController>(UsersController);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    repositoryMock = module.get(getRepositoryToken(Users));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined controller, mockRepository and usersService', () => {
    expect(usersController).toBeDefined();
    expect(repositoryMock).toBeDefined();
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should be allow to retrieve all users', async () => {
    const users: Users[] = [userMock, userMock];
    const mockResponse: ApiResponse<Users[]> = {
      message: 'Users retrieved successfully',
      data: users,
      statusCode: 200,
    };
    jest.spyOn(usersService, 'getUsers').mockImplementation(() => {
      return Promise.resolve(
        mockResponse as unknown as Promise<ApiResponse<Users[]>>,
      );
    });
    const result = await usersController.getUsers();
    expect(result).toEqual(mockResponse);
  });

  it('should be allow to retrieve a user by Id', async () => {
    const mockResponse: ApiResponse<Users> = {
      message: 'User retrieved successfully',
      data: userMock,
      statusCode: 200,
    };
    jest
      .spyOn(usersService, 'getUserBydId')
      .mockImplementation(() =>
        Promise.resolve(mockResponse as unknown as Promise<ApiResponse<Users>>),
      );
    const result = await usersController.getUser('ssed');
    expect(result).toEqual(mockResponse);
  });
  it('should be allow to delete a user by id', async () => {
    const mockResponse: ApiResponse<Users> = {
      message: 'User deleted successfully',
      data: userMock,
      statusCode: 200,
    };
    jest
      .spyOn(usersService, 'deleteUser')
      .mockImplementation(() =>
        Promise.resolve(mockResponse as unknown as Promise<ApiResponse<Users>>),
      );
    const result = await usersController.deleteUser('ssed');
    expect(result).toEqual(mockResponse);
  });
  it('should be allow to delete all users', async () => {
    const mockResponse: ApiResponse<Users> = {
      message: 'Users deleted successfully',
      data: undefined,
      statusCode: 200,
    };
    jest
      .spyOn(usersService, 'deleteAllUsers')
      .mockImplementation(() =>
        Promise.resolve(mockResponse as unknown as Promise<ApiResponse<Users>>),
      );
    const result = await usersController.deleteAllUsers();
    expect(result).toEqual(mockResponse);
  });
});
