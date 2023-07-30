import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

class UserMockClass {
  getAllUsers = jest.fn().mockResolvedValueOnce([]);
  getUserById = jest.fn().mockResolvedValueOnce({});
  updateUser = jest.fn().mockResolvedValueOnce({});
  deleteUser = jest.fn().mockResolvedValueOnce({});
}

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: UserMockClass
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should get all users return all users', async () => {
    const result = await controller.getAllUsers();
    expect(service.getAllUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual([])
  });

  it('should get user by id', async () => {
    const result = await controller.getUserById({userID : 1});
    expect(service.getUserById).toHaveBeenCalledTimes(1);
    expect(service.getUserById).toHaveBeenCalledWith(1);
    expect(result).toEqual({})
  });

  it('should update user by id', async () => {
    const userData = { id: 1, name : 1} 
    const userId = 1
    const result = await controller.updateUser({userID : userId}, userData);
    expect(service.updateUser).toHaveBeenCalledTimes(1);
    expect(service.updateUser).toHaveBeenCalledWith(userId, userData);
    expect(result).toEqual({})
  });

  it('should delete user by id', async () => {
    const userId = 1
    const result = await controller.deleteUser({userID : userId});
    expect(service.deleteUser).toHaveBeenCalledTimes(1);
    expect(service.deleteUser).toHaveBeenCalledWith(userId);
    expect(result).toEqual({})
  });
});
