import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './rooms.entities';
import { RoomCreationParams, RoomPatchParams } from '@checkout/types';

class MockRoomRepository {
  findOne = jest.fn();
  find = jest.fn();
  remove = jest.fn();
  save = jest.fn();
  delete = jest.fn();
}

describe('RoomsService', () => {
  let roomsService: RoomsService;
  let roomRepository: MockRoomRepository;
  const depID = 'example_department_id';
  const existingRoom: Room =
  {
    id: 'example_room_id_1',
    departmentId: depID,
    name: 'name'
  }
    ;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(Room),
          useClass: Repository,
        },
        {
          provide: 'ROOM_REPOSITORY',
          useClass: MockRoomRepository,
        },
      ],
    }).compile();

    roomsService = module.get<RoomsService>(RoomsService);
    roomRepository = module.get<MockRoomRepository>('ROOM_REPOSITORY');
  });

  it('should be defined', () => {
    expect(roomsService).toBeDefined();
  });

  describe('getAllRoomsOfDepartment', () => {
    it('should return an array of rooms when rooms exist in the department', async () => {
      // Arrange
      const existingRooms: Room[] = [
        existingRoom,
        {
          id: 'example_room_id_2',
          departmentId: depID,
          name: 'name'
        },
      ];

      jest.spyOn(roomRepository, 'find').mockResolvedValue(existingRooms);

      // Act
      const result = await roomsService.getAllRoomsOfDepartment(depID);

      // Assert
      expect(roomRepository.find).toHaveBeenCalledWith({
        where: {
          departmentId: depID,
        },
      });
      expect(result).toEqual(existingRooms);
    });

    it('should throw a NotFoundException when no rooms exist in the department', async () => {
      // Arrange
      const depID = 'non_existent_department_id';

      jest.spyOn(roomRepository, 'find').mockResolvedValue([]);

      // Act + Assert
      await expect(roomsService.getAllRoomsOfDepartment(depID)).rejects.toThrowError(
        'Department (ID: non_existent_department_id) has no rooms',
      );
    });

    it('should throw a NotFoundException when the rooms array is null', async () => {
      // Arrange
      const depID = 'non_existent_department_id';

      jest.spyOn(roomRepository, 'find').mockResolvedValue(null);

      // Act + Assert
      await expect(roomsService.getAllRoomsOfDepartment(depID)).rejects.toThrowError(
        'Department (ID: non_existent_department_id) has no rooms',
      );
    });
  });

  describe('getRoomByID', () => {
    it('should return the room with the provided ID when it exists', async () => {
      // Arrange
      const roomID = 'example_room_id';

      roomRepository.findOne.mockResolvedValue(existingRoom);

      // Act
      const result = await roomsService.getRoomByID(roomID);

      // Assert
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomID } });
      expect(result).toEqual(existingRoom);
    });

    it('should throw a NotFoundException when the room with the provided ID does not exist', async () => {
      // Arrange
      const roomID = 'non_existent_room_id';

      roomRepository.findOne.mockResolvedValue(null);

      // Act + Assert
      await expect(roomsService.getRoomByID(roomID)).rejects.toThrowError('Room Not Found');
    });
  });

  describe('updateRoom', () => {
    it('should update and return the room with updated details', async () => {
      // Arrange
      const roomId = 'example_room_id';
      const departmentId = 'example_department_id';
      const roomDetailsToUpdate: RoomPatchParams = {
        name: 'Updated Room Name',
      };

      const existingRoom: Room = {
        id: roomId,
        departmentId: departmentId,
        name: 'Example Room',
      };
      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(existingRoom);

      const updatedRoom: Room = {
        id: roomId,
        departmentId: departmentId,
        ...existingRoom,
        ...roomDetailsToUpdate,
      };
      jest.spyOn(roomRepository, 'save').mockResolvedValue(updatedRoom);

      // Act
      const result = await roomsService.updateRoom(roomId, departmentId, roomDetailsToUpdate);

      // Assert
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomId } });
      expect(roomRepository.save).toHaveBeenCalledWith(updatedRoom);
      expect(result).toEqual(updatedRoom);
    });

    it('should throw an exception when the room does not exist', async () => {
      // Arrange
      const roomId = 'non_existent_room_id';
      const departmentId = 'example_department_id';
      const roomDetailsToUpdate: RoomPatchParams = {
        name: 'Updated Room Name',
      };

      jest.spyOn(roomRepository, 'findOne').mockResolvedValue(null);

      // Act + Assert
      await expect(roomsService.updateRoom(roomId, departmentId, roomDetailsToUpdate)).rejects.toThrowError('Room Not Found');
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomId } });
      expect(roomRepository.save).not.toHaveBeenCalled();
    });
  });


  describe('deleteRoom', () => {
    it('should delete and return the deleted room', async () => {
      // Arrange
      const roomId = 'example_room_id';
      const departmentId = 'example_department_id';

      const existingRoom: Room = {
        id: roomId,
        departmentId: departmentId,
        name: 'Example Room',
      };

      roomRepository.findOne.mockResolvedValue(existingRoom);
      roomRepository.delete.mockResolvedValue(undefined);

      // Act
      const result = await roomsService.deleteRoom(roomId, departmentId);

      // Assert
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomId } });
      expect(roomRepository.delete).toHaveBeenCalledWith(existingRoom);
      expect(result).toEqual(existingRoom);
    });

    it('should throw an exception when the room does not exist', async () => {
      // Arrange
      const roomId = 'non_existent_room_id';
      const departmentId = 'example_department_id';

      roomRepository.findOne.mockResolvedValue(null);

      // Act + Assert
      await expect(roomsService.deleteRoom(roomId, departmentId)).rejects.toThrowError('Room Not Found');
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: roomId } });
      expect(roomRepository.delete).not.toHaveBeenCalled();
    });
  })
});
