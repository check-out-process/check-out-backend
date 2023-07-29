import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entities';
import { Repository } from "typeorm";
import { JobsService } from '../jobs/jobs.service';
import { RolesService } from '../roles/roles.service';
import { SectorsService } from '../sectors/sectors.service';
import { TokensService } from '../tokens/tokens.service';

class MockJobService {}
class MockRolesService {}
class MockSectorsService { }
class MockTokensService {
  removeAllTokenOfUserId = jest.fn();
}
class MockUserRepository {
  findOne = jest.fn();
  find = jest.fn();
  remove = jest.fn();

}

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: MockUserRepository;
  let tokensService: MockTokensService;
  let expectedUser: User;

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
    tokensService = moduleRef.get<MockTokensService>(TokensService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    expectedUser = {
      id: 1,
      fullname: 'afek lev',
      username: 'afek lev',
      phoneNumber: '0527364455',
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
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an empty array if there are no users', async () => {
      // Arrange
      userRepository.find.mockResolvedValue([]);

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(result).toEqual([]);
    });

    it('should return an array of users if there are users in the database', async () => {
      // Arrange
      const mockUsers: User[] = [
        expectedUser,
        {
          id: 2,
          fullname: 'afek lev',
          username: 'afek lev',
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
        }
      ];
      userRepository.find.mockResolvedValue(mockUsers);

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a user when a valid userId is provided', async () => {
      // Arrange
      const userId = 1;
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

  describe('getUserByPhoneNumber', () => {
    it('should return a user when a valid phoneNumber is provided', async () => {
      // Arrange
      const phoneNumber = '0527364455';
      userRepository.findOne.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getUserByPhoneNumber(phoneNumber);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { phoneNumber: phoneNumber } });
    });

    it('should return null if no user is found with the given phone number', async () => {
      // Arrange
      const phoneNumber = '1234567890';
      userRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await userService.getUserByPhoneNumber(phoneNumber);

      // Assert
      expect(result).toBeNull();
    });

  });

  describe('deleteUser', () => {
    it('should delete the user and return the deleted user', async () => {
      // Arrange
      const userId = 1;
      const removeAllTokenOfUserIdMock = jest.fn();
      userRepository.findOne.mockResolvedValue(expectedUser);
      tokensService.removeAllTokenOfUserId = removeAllTokenOfUserIdMock;

      // Act
      const result = await userService.deleteUser(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(removeAllTokenOfUserIdMock).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if an unexpected error occurs while removing tokens', async () => {
      // Arrange
      const userId = 1;
      const removeAllTokenOfUserIdMock = jest.fn().mockRejectedValue(new Error('Unexpected error'));
      userRepository.findOne.mockResolvedValue(expectedUser);
      tokensService.removeAllTokenOfUserId = removeAllTokenOfUserIdMock;

      // Act + Assert
      await expect(userService.deleteUser(userId)).rejects.toThrow(Error);
      expect(removeAllTokenOfUserIdMock).toHaveBeenCalledWith(userId);
    });
  });
});

