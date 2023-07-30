import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './roles.entities';
import { Repository } from 'typeorm';
import { CreateRoleParams } from '@checkout/types';

class MockRoleRepository {
  findOne = jest.fn();
  find = jest.fn();
  create = jest.fn();
  save = jest.fn();
}

describe('RolesService', () => {
  let service: RolesService;
  let roleRepository: MockRoleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: 'ROLE_REPOSITORY',
          useClass: MockRoleRepository,
        },],
    }).compile();

    service = module.get<RolesService>(RolesService);
    roleRepository = module.get<MockRoleRepository>('ROLE_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRole', () => {
    it('should create and return a new role', async () => {
      // Arrange
      const createRoleParams: CreateRoleParams = {
        name: 'Example Role',
      };

      const createdRole: Role = {
        id: 'example_role_id',
        ...createRoleParams,
      };
      roleRepository.create.mockResolvedValue(new Role());
      roleRepository.save.mockResolvedValue(createdRole);

      // Act
      const result = await service.createRole(createRoleParams);

      // Assert
      expect(roleRepository.create).toHaveBeenCalledTimes(1);
      expect(roleRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(createdRole);
    });
  });

  describe('getRoles', () => {
    it('should return all roles', async () => {
      // Arrange
      const roles: Role[] = [
        {
          id: 'role_id_1',
          name: 'Role 1',
        },
        {
          id: 'role_id_2',
          name: 'Role 2',
        },
      ];
      roleRepository.find.mockResolvedValue(roles);

      // Act
      const result = await service.getRoles();

      // Assert
      expect(result).toEqual(roles);
    });
  });

  describe('getRoleById', () => {
    it('should return a role by ID', async () => {
      // Arrange
      const roleId = 'example_role_id';

      const role: Role = {
        id: roleId,
        name: 'Example Role',
      };
      roleRepository.findOne.mockResolvedValue(role);

      // Act
      const result = await service.getRoleById(roleId);

      // Assert
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: roleId } });
      expect(result).toEqual(role);
    });

    it('should return null when a role with the given ID does not exist', async () => {
      // Arrange
      const roleId = 'non_existent_role_id';

      roleRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.getRoleById(roleId);

      // Assert
      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: roleId } });
      expect(result).toBeNull();
    });
  });
});
