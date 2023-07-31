import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entities';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DepartmentCreationParams, DepartmentPatchParams } from '@checkout/types';

class MockDepartmentRepository {
  findOne = jest.fn();
  find = jest.fn();
  create = jest.fn();
  save = jest.fn();
  delete = jest.fn();
}

describe('DepartmentService', () => {
  let service: DepartmentService;
  let departmentRepository: MockDepartmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentService,
        {
          provide: getRepositoryToken(Department),
          useClass: Repository,
        },
        {
          provide: 'DEPARTMENT_REPOSITORY',
          useClass: MockDepartmentRepository,
        },],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
    departmentRepository = module.get<MockDepartmentRepository>('DEPARTMENT_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllDepartments', () => {
    it('should return an array of departments', async () => {
      // Arrange
      const mockDepartments: Department[] = [
        { id: '1', name: 'Department A' },
        { id: '2', name: 'Department B' },
      ];
      jest.spyOn(departmentRepository, 'find').mockResolvedValue(mockDepartments);

      // Act
      const departments = await service.getAllDepartments();

      // Assert
      expect(departments).toEqual(mockDepartments);
    });

    it('should return an empty array when there are no departments', async () => {
      // Arrange
      jest.spyOn(departmentRepository, 'find').mockResolvedValue([]);

      // Act
      const departments = await service.getAllDepartments();

      // Assert
      expect(departments).toEqual([]);
    });
  });

  describe('getDepartmentByID', () => {
    it('should return a department when a valid department ID is provided', async () => {
      // Arrange
      const mockDepartment: Department = { id: '1', name: 'Department A' };
      jest.spyOn(departmentRepository, 'findOne').mockResolvedValue(mockDepartment);
      const departmentId = '1';

      // Act
      const department = await service.getDepartmentByID(departmentId);

      // Assert
      expect(department).toEqual(mockDepartment);
    });

    it('should throw an HttpException with status 404 when an invalid department ID is provided', async () => {
      // Arrange
      departmentRepository.findOne.mockReturnValue(null);
      const departmentId = 'invalid_id';

      // Act + Assert
      await expect(service.getDepartmentByID(departmentId)).rejects.toThrowError(HttpException);
      await expect(service.getDepartmentByID(departmentId)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });
  });

  describe('addDepartment', () => {
    it('should add a new department and return the created department object', async () => {
      // Arrange
      const newDepartmentData: DepartmentCreationParams = { name: 'New Department' };
      jest.spyOn(departmentRepository, 'create').mockReturnValue(new Department());
      jest.spyOn(departmentRepository, 'save').mockResolvedValue(newDepartmentData);

      // Act
      const result = await service.addDepartment(newDepartmentData);

      // Assert
      expect(departmentRepository.create).toHaveBeenCalledTimes(1);
      expect(departmentRepository.save).toHaveBeenCalledTimes(1);
      expect(result.name).toEqual(newDepartmentData.name);
    });
  });

  describe('deleteDepartment', () => {
    it('should delete the department and return the deleted department object', async () => {
      // Arrange
      const departmentToDelete: Department = { id: '1', name: 'Department A' };
      jest.spyOn(departmentRepository, 'delete').mockResolvedValue(undefined);
      jest.spyOn(service, 'getDepartmentByID').mockResolvedValue(departmentToDelete);

      // Act
      const deletedDepartment = await service.deleteDepartment(departmentToDelete.id);

      // Assert
      expect(deletedDepartment).toEqual(departmentToDelete);
    });
  });

  describe('updateDepartment', () => {
    it('should update the department and return the updated department object', async () => {
      const departmentIdToUpdate = '1';
      const updatedDepartmentData: DepartmentPatchParams = { name: 'Updated Department' };
      const existingDepartment: Department = { id: departmentIdToUpdate, name: updatedDepartmentData.name };

      // Mock the behavior of the departmentRepo.save() and departmentService.getDepartmentByID() methods
      jest.spyOn(departmentRepository, 'save').mockResolvedValue(existingDepartment);
      jest.spyOn(service, 'getDepartmentByID').mockResolvedValue(existingDepartment);

      const updatedDepartment = await service.updateDepartment(departmentIdToUpdate, updatedDepartmentData);
      expect(updatedDepartment).toEqual(existingDepartment);
    });
  });
});
