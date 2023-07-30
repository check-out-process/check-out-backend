import { Test, TestingModule } from '@nestjs/testing';
import { BedsController } from './beds.controller';
import { BedsService } from './beds.service';

describe('BedsController', () => {
  let controller: BedsController;
  let bedsService: BedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BedsController],
      providers: [
        {
          provide: BedsService,
          useValue: {
            getAllBedsOfRoom: jest.fn().mockImplementation((roomId) => {
                return [
                  { id: 1, name: 'Bed 1' },
                  { id: 2, name: 'Bed 2' },
                ];
              
            }),
            getBedByID: jest.fn().mockImplementation((bedId) => {
              return { id: 1, name: 'Bed 1' };
            }),
            addBed: jest.fn().mockImplementation((roomId, departmentId, data) => {
              return { id: 3, name: data.name };
            }),
            deleteBed: jest.fn().mockImplementation((bedId, roomId) => {
              return { id: bedId, name: 'Deleted Bed' };
            }),
            updateBed: jest.fn().mockImplementation((bedId, roomId, data) => {
              return { id: bedId, name: data.name };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<BedsController>(BedsController);
    bedsService = module.get<BedsService>(BedsService);
  });

  describe('getAllBeds', () => {
    it('should return an array of beds for a valid room ID', async () => {
      const params = { roomId: 1 };
      const result = await controller.getAllBeds(params);
      expect(result).toEqual([
        { id: 1, name: 'Bed 1' },
        { id: 2, name: 'Bed 2' },
      ]);
      expect(bedsService.getAllBedsOfRoom).toHaveBeenCalledWith(params.roomId);
    });
  });

  describe('getBed', () => {
    it('should return a bed by ID', async () => {
      const params = { bedID: 1 };
      const result = await controller.getBed(params);
      expect(result).toEqual({ id: 1, name: 'Bed 1' });
      expect(bedsService.getBedByID).toHaveBeenCalledWith(params.bedID);
    });
  });

  describe('addBed', () => {
    it('should add a new bed', async () => {
      const params = { roomId: 1, departmentId: 1 };
      const data: any = { name: 'New Bed' };
      const result = await controller.addBed(data, params);
      expect(result).toEqual({ id: 3, name: 'New Bed' });
      expect(bedsService.addBed).toHaveBeenCalledWith(params.roomId, params.departmentId, data);
    });
  });

  describe('deleteBed', () => {
    it('should delete a bed', async () => {
      const params = { bedID: 1, roomId: 1 };
      const result = await controller.deleteBed(params);
      expect(result).toEqual({ id: 1, name: 'Deleted Bed' });
      expect(bedsService.deleteBed).toHaveBeenCalledWith(params.bedID, params.roomId);
    });
  });

  describe('updateBed', () => {
    it('should update an existing bed', async () => {
      const params = { bedID: 1, roomId: 1 };
      const data = { name: 'Updated Bed' };
      const result = await controller.updateBed(data, params);
      expect(result).toEqual({ id: 1, name: 'Updated Bed' });
      expect(bedsService.updateBed).toHaveBeenCalledWith(params.bedID, params.roomId, data);
    });
  });
});
