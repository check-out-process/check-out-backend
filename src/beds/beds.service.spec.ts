import { Test, TestingModule } from '@nestjs/testing';
import { BedsService } from './beds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bed } from './beds.entities';
import { BedCreationParams, BedPatchParams } from '@checkout/types';

class MockBedRepository {
  findOne = jest.fn();
  find = jest.fn();
  create = jest.fn();
  save = jest.fn();
  delete = jest.fn();
}

describe('BedsService', () => {
  let service: BedsService;
  let bedRepository: MockBedRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BedsService, {
        provide: getRepositoryToken(Bed),
        useClass: Repository,
      },
        {
          provide: 'BED_REPOSITORY',
          useClass: MockBedRepository,
        },],
    }).compile();

    service = module.get<BedsService>(BedsService);
    bedRepository = module.get<MockBedRepository>('BED_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('getBedByID', () => {
    it('should return a bed by ID', async () => {
      // Arrange
      const bedId = 'example_bed_id';

      const bed: Bed = {
        id: bedId,
        roomId: 'example_room_id',
        departmentId: 'example_department_id',
        textQR: '',
        name: ''
      };
      bedRepository.findOne.mockResolvedValue(bed);

      // Act
      const result = await service.getBedByID(bedId);

      // Assert
      expect(bedRepository.findOne).toHaveBeenCalledWith({ where: { id: bedId } });
      expect(result).toEqual(bed);
    });

    it('should return null when a bed with the given ID does not exist', async () => {
      // Arrange
      const bedId = 'non_existent_bed_id';

      bedRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.getBedByID(bedId);

      // Assert
      expect(bedRepository.findOne).toHaveBeenCalledWith({ where: { id: bedId } });
      expect(result).toBeNull();
    });
  });

  describe('getAllBedsOfRoom', () => {
    it('should return all beds of a room', async () => {
      // Arrange
      const roomId = 'example_room_id';

      const beds: Bed[] = [
        {
          id: 'bed_id_1',
          roomId: 'example_room_id',
          departmentId: 'example_department_id',
          textQR: '',
          name: ''
        },
        {
          id: 'bed_id_2',
          roomId: roomId,
          departmentId: 'department_id_2',
          textQR: '',
          name: ''
        },
      ];
      bedRepository.find.mockResolvedValue(beds);

      // Act
      const result = await service.getAllBedsOfRoom(roomId);

      // Assert
      expect(result).toEqual(beds);
    });

    it('should throw NotFoundException when no beds are found in the room', async () => {
      // Arrange
      const roomId = 'non_existent_room_id';

      bedRepository.find.mockResolvedValue([]);

      // Act + Assert
      await expect(service.getAllBedsOfRoom(roomId)).rejects.toThrowError(
        'Room (ID: non_existent_room_id) has no beds assigned',
      );
    });
  });

  describe('addBed', () => {
    it('should add a new bed to the room', async () => {
      // Arrange
      const roomId = 'example_room_id';
      const departmentId = 'example_department_id';
      const bedCreationParams: BedCreationParams = {
        textQR: 'string',
        name: 'string',
        departmentId: departmentId,
        roomId: roomId
      };

      const createdBed: Bed = {
        id: 'example_bed_id',
        ...bedCreationParams,
      };
      bedRepository.save.mockResolvedValue(createdBed);
      bedRepository.create.mockResolvedValue(new Bed());

      // Act
      const result = await service.addBed(roomId, departmentId, bedCreationParams);

      // Assert
      expect(bedRepository.create).toHaveBeenCalledTimes(1);
      expect(bedRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteBed', () => {
    it('should delete a bed by ID', async () => {
      // Arrange
      const bedId = 'example_bed_id';
      const roomId = 'example_room_id';

      const bedToDelete: Bed = {
        textQR: 'string',
        name: 'string',
        departmentId: 'departmentId',
        roomId: roomId,
        id: bedId
      };
      bedRepository.delete.mockResolvedValue(bedToDelete);
      bedRepository.findOne.mockResolvedValue(bedToDelete);

      // Act
      const result = await service.deleteBed(bedId, roomId);

      // Assert
      expect(bedRepository.findOne).toHaveBeenCalledWith({ where: { id: bedId } });
      expect(bedRepository.delete).toHaveBeenCalledWith(bedToDelete);
      expect(result).toEqual(bedToDelete);
    });
  });

  describe('updateBed', () => {
    it('should update a bed by ID', async () => {
      // Arrange
      const bedId = 'example_bed_id';
      const roomId = 'example_room_id';
      const bedPatchParams: BedPatchParams = {
        textQR: 'stringggg',
      };

      const bed: Bed = {
        textQR: 'string',
        name: 'string',
        departmentId: 'departmentId',
        roomId: roomId,
        id: bedId,
      };

      const updatedBed: Bed = {
        textQR: 'stringggg',
        name: 'string',
        departmentId: 'departmentId',
        roomId: roomId,
        id: bedId,
      };
      bedRepository.save.mockResolvedValue(updatedBed);
      bedRepository.findOne.mockResolvedValue(bed);

      // Act
      const result = await service.updateBed(bedId, roomId, bedPatchParams);

      // Assert
      expect(bedRepository.findOne).toHaveBeenCalledWith({ where: { id: bedId } });
      expect(bedRepository.save).toHaveBeenCalledWith(updatedBed);
      expect(result).toEqual(updatedBed);
    });
  });
});
