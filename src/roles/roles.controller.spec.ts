import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { CreateRoleParams } from '@checkout/types';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            getRoles: jest.fn().mockResolvedValue([
              { id: 1, name: 'Admin' },
              { id: 2, name: 'User' },
            ]),
            getRoleById: jest.fn().mockImplementation((id: number) => {
              return { id, name: `Role ${id}` };
            }),
            createRole: jest.fn().mockImplementation((data: CreateRoleParams) => {
              return { id: 3, ...data };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  describe('getRoles', () => {
    it('should return an array of roles', async () => {
      const result = await controller.getRoles();
      expect(result).toEqual([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
      ]);
    });

    it('should call getRoles method', async () => {
      await controller.getRoles();
      expect(service.getRoles).toHaveBeenCalled();
    });
  });

  describe('getRoleById', () => {
    it('should return a role by roleId', async () => {
      const roleId = 1;
      const result = await controller.getRoleById({ roleId });
      expect(result).toEqual({ id: roleId, name: 'Role 1' });
    });

    it('should call getRoleById method with correct roleId', async () => {
      const roleId = 1;
      await controller.getRoleById({ roleId });
      expect(service.getRoleById).toHaveBeenCalledWith(roleId);
    });
  });

  describe('createRole', () => {
    it('should create a new role and return the created role', async () => {
      const roleData = { name: 'New Role' };
      const result = await controller.createRole(roleData);
      expect(result).toEqual({ id: 3, ...roleData });
    });

    it('should call createRole method with correct data', async () => {
      const roleData = { name: 'New Role' };
      await controller.createRole(roleData);
      expect(service.createRole).toHaveBeenCalledWith(roleData);
    });
  });
});
