import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomCreationParams, RoomPatchParams } from '@checkout/types';

describe('RoomsController', () => {
  let controller: RoomsController;
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        {
          provide: RoomsService,
          useValue: {
            getAllRoomsOfDepartment: jest.fn().mockResolvedValue([
              { id: 1, name: 'Room A' },
              { id: 2, name: 'Room B' },
            ]),
            getRoomByID: jest.fn().mockImplementation((id: number) => {
              return { id, name: `Room ${id}` };
            }),
            createRoom: jest.fn().mockImplementation((departmentId: number, data: RoomCreationParams) => {
              return { id: 3, ...data, departmentId };
            }),
            updateRoom: jest.fn().mockImplementation((roomId: number, departmentId: number, data: RoomPatchParams) => {
              return { id: roomId, ...data, departmentId };
            }),
            deleteRoom: jest.fn().mockImplementation((roomId: number, departmentId: number) => {
              return { id: roomId, departmentId };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    service = module.get<RoomsService>(RoomsService);
  });

  describe('getAllRooms', () => {
    it('should return an array of rooms for a department', async () => {
      const departmentId = 1;
      const result = await controller.getAllRooms({ departmentId });
      expect(result).toEqual([
        { id: 1, name: 'Room A' },
        { id: 2, name: 'Room B' },
      ]);
    });

    it('should call getAllRoomsOfDepartment method with correct departmentId', async () => {
      const departmentId = 1;
      await controller.getAllRooms({ departmentId });
      expect(service.getAllRoomsOfDepartment).toHaveBeenCalledWith(departmentId);
    });
  });

  describe('getRoom', () => {
    it('should return a room by roomID', async () => {
      const roomId = 1;
      const result = await controller.getRoom({ roomID: roomId });
      expect(result).toEqual({ id: roomId, name: 'Room 1' });
    });

    it('should call getRoomByID method with correct roomID', async () => {
      const roomId = 1;
      await controller.getRoom({ roomID: roomId });
      expect(service.getRoomByID).toHaveBeenCalledWith(roomId);
    });
  });

  describe('createRoom', () => {
    it('should create a new room and return the created room', async () => {
      const departmentId = 1;
      const roomData = { name: 'New Room' };
      const result = await controller.creatRoom({ departmentId }, roomData);
      expect(result).toEqual({ id: 3, name: 'New Room', departmentId });
    });

    it('should call createRoom method with correct departmentId and data', async () => {
      const departmentId = 1;
      const roomData = { name: 'New Room' };
      await controller.creatRoom({ departmentId }, roomData);
      expect(service.createRoom).toHaveBeenCalledWith(departmentId, roomData);
    });
  });

  describe('updateRoom', () => {
    it('should update a room and return the updated room', async () => {
      const roomId = 1;
      const departmentId = 2;
      const roomPatchData = { name: 'Updated Room' };
      const result = await controller.updateRoom(roomPatchData, { roomID: roomId, departmentId });
      expect(result).toEqual({ id: roomId, name: 'Updated Room', departmentId });
    });

    it('should call updateRoom method with correct roomId, departmentId, and data', async () => {
      const roomId = 1;
      const departmentId = 2;
      const roomPatchData = { name: 'Updated Room' };
      await controller.updateRoom(roomPatchData, { roomID: roomId, departmentId });
      expect(service.updateRoom).toHaveBeenCalledWith(roomId, departmentId, roomPatchData);
    });
  });

  describe('deleteRoom', () => {
    it('should delete a room and return the deleted room', async () => {
      const roomId = 1;
      const departmentId = 2;
      const result = await controller.deleteRoom({ roomID: roomId, departmentId });
      expect(result).toEqual({ id: roomId, departmentId });
    });

    it('should call deleteRoom method with correct roomId and departmentId', async () => {
      const roomId = 1;
      const departmentId = 2;
      await controller.deleteRoom({ roomID: roomId, departmentId });
      expect(service.deleteRoom).toHaveBeenCalledWith(roomId, departmentId);
    });
  });
});
