import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

describe('DepartmentController', () => {
  let controller: DepartmentController;
  let departmentService: DepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        {
          provide: DepartmentService,
          useValue: {
            getAllDepartments: jest.fn().mockResolvedValue([
              { id: 1, name: 'Department 1' },
              { id: 2, name: 'Department 2' },
            ]),
            getDepartmentByID: jest.fn().mockImplementation((departmentID) => {
              return { id: 1, name: 'Department 1' };
            }),
            addDepartment: jest.fn().mockImplementation((data) => {
              return { id: 3, name: data.name };
            }),
            updateDepartment: jest.fn().mockImplementation((departmentID, data) => {
              return { id: departmentID, name: data.name };
            }),
            deleteDepartment: jest.fn().mockImplementation((departmentID) => {
              return { id: departmentID, name: 'Deleted Department' };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);
    departmentService = module.get<DepartmentService>(DepartmentService);
  });

  describe('getAllDepartments', () => {
    it('should return an array of departments', async () => {
      const result = await controller.getAllDepartments();
      expect(result).toEqual([
        { id: 1, name: 'Department 1' },
        { id: 2, name: 'Department 2' },
      ]);
      expect(departmentService.getAllDepartments).toHaveBeenCalled();
    });
  });

  describe('getDepartment', () => {
    it('should return a department by ID', async () => {
      const params = { departmentID: 1 };
      const result = await controller.getDepartment(params);
      expect(result).toEqual({ id: 1, name: 'Department 1' });
      expect(departmentService.getDepartmentByID).toHaveBeenCalledWith(params.departmentID);
    });
  });

  describe('addDepartment', () => {
    it('should add a new department', async () => {
      const data = { name: 'New Department' };
      const result = await controller.addDepartment(data);
      expect(result).toEqual({ id: 3, name: 'New Department' });
      expect(departmentService.addDepartment).toHaveBeenCalledWith(data);
    });
  });

  describe('editDepartment', () => {
    it('should edit an existing department', async () => {
      const params = { departmentID: 1 };
      const data = { name: 'Edited Department' };
      const result = await controller.editDepartment(params, data);
      expect(result).toEqual({ id: 1, name: 'Edited Department' });
      expect(departmentService.updateDepartment).toHaveBeenCalledWith(params.departmentID, data);
    });
  });

  describe('deleteDepartment', () => {
    it('should delete a department', async () => {
      const params = { departmentID: 1 };
      const result = await controller.deleteDepartment(params);
      expect(result).toEqual({ id: 1, name: 'Deleted Department' });
      expect(departmentService.deleteDepartment).toHaveBeenCalledWith(params.departmentID);
    });
  });
});
