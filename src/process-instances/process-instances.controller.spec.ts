import { Test, TestingModule } from '@nestjs/testing';
import { ProcessInstancesController } from './process-instances.controller';
import { CreateProcessInstanceFromDataParams, UpdateSectorInstanceParams, UpdateSectorStatusParams, Status } from '@checkout/types';
import { ProcessInstancesService } from './process-instances.service';
const moduleUser = require('../auth/auth.helper')

describe('ProcessInstancesController', () => {
  let controller: ProcessInstancesController;
  let processInstancesService: ProcessInstancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessInstancesController],
      providers: [
        {
          provide: ProcessInstancesService,
          useValue: {
            getUserProcessInstances: jest.fn().mockResolvedValue([
              { id: 1, name: 'Process Instance 1' },
              { id: 2, name: 'Process Instance 2' },
            ]),
            getUserProcessInstance: jest.fn().mockImplementation((processId: number, userId: number) => {
              return { id: processId, name: `Process Instance ${processId}`, userId };
            }),
            createProcessInstanceFromData: jest.fn().mockImplementation((data: CreateProcessInstanceFromDataParams) => {
              return { id: 3, ...data };
            }),
            updateSectorInstance: jest.fn().mockImplementation((data: UpdateSectorInstanceParams, processId: number, sectorId: number) => {
              return { id: processId, ...data };
            }),
            getProcessStatus: jest.fn().mockImplementation((bedId: number, userId: number) => {
              return { bedId, userId, status: 'Status A' };
            }),
            updateProcessStatus: jest.fn().mockImplementation((bedId: number, data: UpdateSectorStatusParams, userId: number) => {
              return { bedId, ...data, userId };
            }),
            updateSectorInstanceStatus: jest.fn(),
            sendFinsihMessageToSector: jest.fn(),
            getSectorInstance: jest.fn().mockResolvedValue({ id: 1, status: Status.In_Progress }),
            notifyNextCommitingSectorProcess: jest.fn().mockResolvedValue(true)
          },
        }
      ],
    }).compile();

    controller = module.get<ProcessInstancesController>(ProcessInstancesController);
    processInstancesService = module.get<ProcessInstancesService>(ProcessInstancesService);
  });

  describe('getUserProcessInstances', () => {
    it('should return an array of user process instances', async () => {
      const headers = { 'x-access-token': 'user_token' };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})
      const result = await controller.getUserProcessInstances(headers);
      expect(result).toEqual([
        { id: 1, name: 'Process Instance 1' },
        { id: 2, name: 'Process Instance 2' },
      ]);
    });

    it('should call getUserProcessInstances method with correct headers', async () => {
      const headers = { 'x-access-token': 'user_token' };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})
      await controller.getUserProcessInstances(headers);
      expect(processInstancesService.getUserProcessInstances).toHaveBeenCalledWith(123);
    });
  });

  describe('getUserProcessInstance', () => {
    it('should return a user process instance by processId', async () => {
      const params = { processId: 1 };
      const headers = { 'x-access-token': 'user_token' };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})
      const result = await controller.getUserProcessInstance(params, headers);
      expect(result).toEqual({ id: 1, name: 'Process Instance 1', userId: 123 });
    });

    it('should call getUserProcessInstance method with correct params and headers', async () => {
      const params = { processId: 1 };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})
      const headers = { 'x-access-token': 'user_token' };
      await controller.getUserProcessInstance(params, headers);
      expect(processInstancesService.getUserProcessInstance).toHaveBeenCalledWith(1, 123);
    });
  });

  describe('createProcessInstance', () => {
    it('should create a new process instance and return the created instance', async () => {
      const data: any = { };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})

      const result = await controller.createProcessInstance(data);
      expect(result).toEqual({ id: 3, ...data });
    });

    it('should call createProcessInstanceFromData and notifyNextCommitingSectorProcess methods', async () => {
      const data: any = {  };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})

      await controller.createProcessInstance(data);
      expect(processInstancesService.createProcessInstanceFromData).toHaveBeenCalledWith(data);
      expect(processInstancesService.notifyNextCommitingSectorProcess).toHaveBeenCalled();
    });
  });

  describe('updateSectorInstance', () => {
    it('should update a sector instance and return the updated process instance', async () => {
      const params = { processId: 1, sectorId: 2 };
      const data: any = { };
      const result = await controller.updateSectorInstance(params, data);
      expect(result).toEqual({ id: 1, ...data });
    });

    it('should call updateSectorInstance method with correct params', async () => {
      const params = { processId: 1, sectorId: 2 };
      const data: any = {  };
      await controller.updateSectorInstance(params, data);
      expect(processInstancesService.updateSectorInstance).toHaveBeenCalledWith(data, 1, 2);
    });
  });

  describe('getProcessStatus', () => {
    it('should return the process instance status by bedId', async () => {
      const params = { bedId: 1 };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})

      const headers = { 'x-access-token': 'user_token' };
      const result = await controller.getProcessStatus(params, headers);
      expect(result).toEqual({ bedId: 1, userId: 123, status: 'Status A' });
    });

    it('should call getProcessStatus method with correct params and headers', async () => {
      const params = { bedId: 1 };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})

      const headers = { 'x-access-token': 'user_token' };
      await controller.getProcessStatus(params, headers);
      expect(processInstancesService.getProcessStatus).toHaveBeenCalledWith(1, 123);
    });
  });

  describe('updateProcessStatus', () => {
    it('should update the process instance status and return the updated process instance', async () => {
      const params = { bedId: 1 };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})

      const data = {};
      const headers = { 'x-access-token': 'user_token' };
      const result = await controller.updateProcessStatus(params, headers, data as any);
      expect(result).toBeUndefined();
    });

    it('should call updateProcessStatus method with correct params and headers', async () => {
      const params = { bedId: 1 };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})

      const data: any = { };
      const headers = { 'x-access-token': 'user_token' };
      await controller.updateProcessStatus(params, headers, data);
      expect(processInstancesService.updateProcessStatus).toHaveBeenCalledWith(1, data, 123);
    });
  });

  describe('updateSectorStartWork', () => {
    it('should update the sector status to In_Progress and send a finish message to sector', async () => {
      const params = { processInstanceId: 1, sectorInstanceId: 2 };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})

      const headers = { 'x-access-token': 'user_token' };
      const result = await controller.updateSectorStartWork(params, headers);
      expect(result).toBeUndefined();
    });

    it('should call updateSectorInstanceStatus and sendFinsihMessageToSector methods with correct params', async () => {
      const params = { processInstanceId: 1, sectorInstanceId: 2 };
      const headers = { 'x-access-token': 'user_token' };
      jest.spyOn(moduleUser, 'getUserDecoded').mockReturnValue({id : 123})

      await controller.updateSectorStartWork(params, headers);
      expect(processInstancesService.updateSectorInstanceStatus).toHaveBeenCalledWith(
        { id: 1, status: Status.In_Progress }, 
        Status.In_Progress,
      );
      expect(processInstancesService.sendFinsihMessageToSector).toHaveBeenCalledWith(
      { id: 1, status: Status.In_Progress },
        1,
      );
    });
  });
});
