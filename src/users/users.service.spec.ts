import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entities';
import { Repository } from "typeorm";
import { JobsService } from '../jobs/jobs.service';
import { RolesService } from '../roles/roles.service';
import { SectorsService } from '../sectors/sectors.service';
import { TokensService } from '../tokens/tokens.service';

class MockJobService { }
class MockRolesService { }
class MockSectorsService { }
class MockTokensService { }
class MockUserRepository {
  findOne = jest.fn();
}

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: MockUserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: 'USER_REPOSITORY',
          useClass: MockUserRepository,
        },
        { provide: JobsService, useClass: MockJobService },
        { provide: RolesService, useClass: MockRolesService },
        { provide: SectorsService, useClass: MockSectorsService },
        { provide: TokensService, useClass: MockTokensService },
      ],
    }).compile();

    userService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<MockUserRepository>('USER_REPOSITORY');

  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should return a user when a valid userId is provided', async () => {
    // Arrange
    const userId = 1;
    const expectedUser: User = {
      id: 1,
      fullname: 'John Doe',
      username: '',
      phoneNumber: '',
      password: '',
      job: {
        id: '',
        name: ''
      },
      role: {
        id: '',
        name: ''
      },
      sectors: undefined,
      sectors_in_responsibility: undefined
    };
    userRepository.findOne.mockResolvedValue(expectedUser);

    // Act
    const result = await userService.getUserById(userId);

    // Assert
    expect(result).toEqual(expectedUser);
    expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
  });

  it('should return null when userId is falsy', async () => {
    // Arrange
    const userId = null;

    // Act
    const result = await userService.getUserById(userId);

    // Assert
    expect(result).toBeNull();
  });
});

