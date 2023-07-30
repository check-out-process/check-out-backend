import { Test, TestingModule } from '@nestjs/testing';
import { ProcessTemplatesService } from './process-templates.service';
import { Repository } from 'typeorm';
import { ProcessTemplate } from '@checkout/types';
import { ProcessType } from './process-templates.entities';

class MockProcessTemplateRepository {
  findOne = jest.fn();
  find = jest.fn();
  remove = jest.fn();
  save = jest.fn();
  create = jest.fn();
}

class MockProcessTypeRepository {
  findOne = jest.fn();
  find = jest.fn();
  remove = jest.fn();
  save = jest.fn();
  create = jest.fn();
}

describe('ProcessTemplatesService', () => {
  let service: ProcessTemplatesService;
  let processTemplatesRepo: MockProcessTemplateRepository;
  let processTypesRepo: MockProcessTypeRepository;

  const mockProcessTemplates: ProcessTemplate[] = [
    { id: '1', name: 'Template 1' },
    { id: '2', name: 'Template 2' },
  ] as any;

  const mockProcessTypes: ProcessType[] = [
    { id: 1, type: 'Type 1' },
    { id: 2, type: 'Type 2' },
  ] as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessTemplatesService,
        {
          provide: 'PROCESS_TEMPLATE_REPOSITORY',
          useClass: MockProcessTemplateRepository
        },
        {
          provide: 'PROCESS_TYPE_REPOSITORY',
          useClass: MockProcessTypeRepository
        },
      ],
    }).compile();

    service = module.get<ProcessTemplatesService>(ProcessTemplatesService);
    processTemplatesRepo = module.get<MockProcessTemplateRepository>('PROCESS_TEMPLATE_REPOSITORY');
    processTypesRepo = module.get<MockProcessTypeRepository>('PROCESS_TYPE_REPOSITORY');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProcessTemplates', () => {
    it('should return an array of process templates', async () => {
      processTemplatesRepo.find.mockResolvedValueOnce(mockProcessTemplates)

      const result = await service.getAllProcessTemplates();
      
      expect(result).toEqual(mockProcessTemplates);
    });
  });

  describe('getProcessTypes', () => {
    it('should return an array of process types', async () => {
      processTypesRepo.find.mockResolvedValueOnce(mockProcessTypes)

      const result = await service.getProcessTypes();

      expect(result).toEqual(mockProcessTypes);
    });
  });

  describe('getProcessTemplateById', () => {
    it('should return the process template with the specified id', async () => {
      processTemplatesRepo.findOne.mockResolvedValueOnce(mockProcessTemplates[0])

      const result = await service.getProcessTemplateById('1');
      
      expect(result).toEqual(mockProcessTemplates[0]);
    });
  });

  describe('getProcessTypeByID', () => {
    it('should return the process type with the specified id', async () => {
      processTypesRepo.findOne.mockResolvedValueOnce(mockProcessTypes[0])
      
      const result = await service.getProcessTypeByID(1);
      
      expect(result).toEqual(mockProcessTypes[0]);
    });

    it('should return undefined if process type with the specified id is not found', async () => {
      const result = await service.getProcessTypeByID(999);
      expect(result).toBeUndefined();
    });
  });

  describe('addProcessTemplate', () => {
    it('should create and return a new process template', async () => {
      const data = { };
      processTemplatesRepo.save.mockResolvedValueOnce(data);
      processTemplatesRepo.create.mockResolvedValueOnce(data)

      const result = await service.addProcessTemplate(data as any);
      
      expect(result).toEqual(data);
      expect(processTemplatesRepo.create).toHaveBeenCalledTimes(1)
      expect(processTemplatesRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateProcessTemplate', () => {
    it('should update and return the updated process template', async () => {
      const processId = '1';
      const data = { name: 'Updated Template' };
      const expectedResponse = {
        ...mockProcessTemplates[0],
        ...data,
      } 
      jest.spyOn(service, 'getProcessTemplateById').mockResolvedValue(mockProcessTemplates[0] as any);
      processTemplatesRepo.save.mockResolvedValueOnce(expectedResponse);
      
      const result = await service.updateProcessTemplate(processId, data);
      
      expect(result).toEqual(expectedResponse);
      expect(service.getProcessTemplateById).toHaveBeenCalledWith(processId);
      expect(processTemplatesRepo.save).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('deleteProcessTemplate', () => {
    it('should delete and return the deleted process template', async () => {
      const processId = '1';
      jest.spyOn(service, 'getProcessTemplateById').mockResolvedValue(mockProcessTemplates[0] as any);
      processTemplatesRepo.remove.mockResolvedValueOnce(mockProcessTemplates[0] as any)
      
      const result = await service.deleteProcessTemplate(processId);
      
      expect(result).toEqual(mockProcessTemplates[0]);
      expect(service.getProcessTemplateById).toHaveBeenCalledWith(processId);
      expect(processTemplatesRepo.remove).toHaveBeenCalledWith(mockProcessTemplates[0]);
    });
  });
});
