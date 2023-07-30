import { Test, TestingModule } from '@nestjs/testing';
import { ProcessTemplatesController } from './process-templates.controller';
import { AddProcessTemplateParams, AddProcessTypeParams, PatchProcessTemplateParams } from '@checkout/types';
import { ProcessTemplatesService } from './process-templates.service';

describe('ProcessTemplatesController', () => {
  let controller: ProcessTemplatesController;
  let service: ProcessTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessTemplatesController],
      providers: [
        {
          provide: ProcessTemplatesService,
          useValue: {
            // Mock or stub the methods of ProcessTemplatesService that the controller uses
            getAllProcessTemplates: jest.fn().mockResolvedValue([
              { id: 1, name: 'Process A' },
              { id: 2, name: 'Process B' },
            ]),
            getProcessTypes: jest.fn().mockResolvedValue([
              { id: 1, name: 'Type A' },
              { id: 2, name: 'Type B' },
            ]),
            getProcessTemplateById: jest.fn().mockImplementation((id: number) => {
              return { id, name: `Process ${id}` };
            }),
            getProcessTypeByID: jest.fn().mockImplementation((id: number) => {
              return { id, name: `Type ${id}` };
            }),
            addProcessTemplate: jest.fn().mockImplementation((data: AddProcessTemplateParams) => {
              return { id: 3, ...data };
            }),
            addProcessType: jest.fn().mockImplementation((data: AddProcessTypeParams) => {
              return { id: 3, ...data };
            }),
            updateProcessTemplate: jest.fn().mockImplementation((processId: number, data: PatchProcessTemplateParams) => {
              return { id: processId, ...data };
            }),
            deleteProcessTemplate: jest.fn().mockImplementation((processId: number) => {
              return { id: processId, name: `Process ${processId}` };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ProcessTemplatesController>(ProcessTemplatesController);
    service = module.get<ProcessTemplatesService>(ProcessTemplatesService);
  });

  describe('getAllProcesses', () => {
    it('should return an array of process templates', async () => {
      const result = await controller.getAllProcesses();
      expect(result).toEqual([
        { id: 1, name: 'Process A' },
        { id: 2, name: 'Process B' },
      ]);
    });

    it('should call getAllProcessTemplates method', async () => {
      await controller.getAllProcesses();
      expect(service.getAllProcessTemplates).toHaveBeenCalled();
    });
  });

  describe('getAllProcessTypes', () => {
    it('should return an array of process types', async () => {
      const result = await controller.getAllProcessTypes();
      expect(result).toEqual([
        { id: 1, name: 'Type A' },
        { id: 2, name: 'Type B' },
      ]);
    });

    it('should call getProcessTypes method', async () => {
      await controller.getAllProcessTypes();
      expect(service.getProcessTypes).toHaveBeenCalled();
    });
  });

  describe('getProcess', () => {
    it('should return a process template by processId', async () => {
      const processId = 1;
      const result = await controller.getProcess({ processId });
      expect(result).toEqual({ id: processId, name: 'Process 1' });
    });

    it('should call getProcessTemplateById method with correct processId', async () => {
      const processId = 1;
      await controller.getProcess({ processId });
      expect(service.getProcessTemplateById).toHaveBeenCalledWith(processId);
    });
  });

  describe('getProcessType', () => {
    it('should return a process type by typeId', async () => {
      const typeId = 1;
      const result = await controller.getProcessType({ typeId });
      expect(result).toEqual({ id: typeId, name: 'Type 1' });
    });

    it('should call getProcessTypeByID method with correct typeId', async () => {
      const typeId = 1;
      await controller.getProcessType({ typeId });
      expect(service.getProcessTypeByID).toHaveBeenCalledWith(typeId);
    });
  });

  describe('createProcess', () => {
    it('should create a new process template and return the created template', async () => {
      const processData = { name: 'New Process' };
      const result = await controller.createProcess(processData as any);
      expect(result).toEqual({ id: 3, ...processData });
    });

    it('should call addProcessTemplate method with correct data', async () => {
      const processData = { name: 'New Process' };
      await controller.createProcess(processData as any);
      expect(service.addProcessTemplate).toHaveBeenCalledWith(processData);
    });
  });

  describe('createProcessType', () => {
    it('should create a new process type and return the created type', async () => {
      const processTypeData = { name: 'New Process Type' };
      const result = await controller.createProcessType(processTypeData);
      expect(result).toEqual({ id: 3, ...processTypeData });
    });

    it('should call addProcessType method with correct data', async () => {
      const processTypeData = { name: 'New Process Type' };
      await controller.createProcessType(processTypeData);
      expect(service.addProcessType).toHaveBeenCalledWith(processTypeData);
    });
  });

  describe('updateProcess', () => {
    it('should update a process template and return the updated template', async () => {
      const processId = 1;
      const processPatchData = { name: 'Updated Process' };
      const result = await controller.updateProcess({ processId }, processPatchData);
      expect(result).toEqual({ id: processId, ...processPatchData });
    });

    it('should call updateProcessTemplate method with correct processId and data', async () => {
      const processId = 1;
      const processPatchData = { name: 'Updated Process' };
      await controller.updateProcess({ processId }, processPatchData);
      expect(service.updateProcessTemplate).toHaveBeenCalledWith(processId, processPatchData);
    });
  });

  describe('deleteProcess', () => {
    it('should delete a process template and return the deleted template', async () => {
      const processId = 1;
      const result = await controller.deleteProcess({ processId });
      expect(result).toEqual({ id: processId, name: `Process ${processId}` });
    });

    it('should call deleteProcessTemplate method with correct processId', async () => {
      const processId = 1;
      await controller.deleteProcess({ processId });
      expect(service.deleteProcessTemplate).toHaveBeenCalledWith(processId);
    });
  });
});
