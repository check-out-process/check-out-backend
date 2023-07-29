import { HttpException, HttpStatus } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { Repository } from 'typeorm';
import { Sector } from './sectors.entities';
import { SectorQueryParams } from '@checkout/types';
import { User } from '../users/users.entities';
import { UsersHelper } from '../users/users.helper';

jest.mock('typeorm');
jest.mock('../users/users.helper');
jest.mock('../process-templates/process-templates.helper');

describe('SectorsService', () => {
  let sectorsService: SectorsService;
  let mockSectorsRepo: jest.Mocked<Repository<Sector>>;
  let sector: Sector;

  beforeEach(() => {
    mockSectorsRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      create: jest.fn(),
    } as any;

    sectorsService = new SectorsService(mockSectorsRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    sector = {
      id: '1',
      name: 'Sector 1',
      defaultResponsibleUser: null,
      responsibleUsers: [],
      defaultCommittingUser: null,
      committingUsers: [],
      relatedProcesses: [],
      processTypes: [],
    }
  })

  it('should be defined', () => {
    expect(sectorsService).toBeDefined();
  });

  describe('getAllSectors', () => {
    it('should return all sectors', async () => {
      // Arrange
      const sectors: Sector[] = [
        sector,
        {
          id: '2',
          name: 'Sector 2',
          defaultResponsibleUser: null,
          responsibleUsers: [],
          defaultCommittingUser: null,
          committingUsers: [],
          relatedProcesses: [],
          processTypes: [],
        },
      ];
      mockSectorsRepo.find.mockResolvedValue(sectors);

      // Act
      const result = await sectorsService.getAllSectors();

      // Assert
      expect(result).toEqual(sectors);
      expect(mockSectorsRepo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSector', () => {
    it('should return the sector by ID', async () => {
      // Arrange
      const sectorId = '1';
      mockSectorsRepo.findOne.mockResolvedValue(sector);

      // Act
      const result = await sectorsService.getSector(sectorId);

      // Assert
      expect(result).toEqual(sector);
      expect(mockSectorsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockSectorsRepo.findOne).toHaveBeenCalledWith({ where: { id: sectorId } });
    });

    it('should throw an HttpException with HttpStatus.NOT_FOUND if sector is not found', async () => {
      // Arrange
      const sectorId = '1';
      mockSectorsRepo.findOne.mockResolvedValue(null);

      // Act + Assert
      try {
        await sectorsService.getSector(sectorId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBe('Sector not found');
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(mockSectorsRepo.findOne).toHaveBeenCalledTimes(1);
        expect(mockSectorsRepo.findOne).toHaveBeenCalledWith({ where: { id: sectorId } });
      }
    });

    it('should throw an error if the database throws an error', async () => {
      // Arrange
      const sectorId = '1';
      const errorMessage = 'Database error';
      mockSectorsRepo.findOne.mockRejectedValue(new Error(errorMessage));

      // Act + Assert
      try {
        await sectorsService.getSector(sectorId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(errorMessage);
        expect(mockSectorsRepo.findOne).toHaveBeenCalledTimes(1);
        expect(mockSectorsRepo.findOne).toHaveBeenCalledWith({ where: { id: sectorId } });
      }
    });
  });

  describe('getSectorsByFilter', () => {
    it('should return undefined when no processtype provided', async () => {
      // Arrange
      const sectorsData: Sector[] = [
        sector,
        {
          id: '2',
          name: 'Sector 2',
          defaultResponsibleUser: null,
          responsibleUsers: [],
          defaultCommittingUser: null,
          committingUsers: [],
          relatedProcesses: [],
          processTypes: [],
        },
      ];
      mockSectorsRepo.find.mockResolvedValue(sectorsData);
      const queryParams: SectorQueryParams = {};

      // Act
      const result = await sectorsService.getSectorsByFilter(queryParams);

      // Assert
      expect(result).toEqual(undefined);
    });

    it('should return sectors filtered by process type when processtype param is provided', async () => {
      // Arrange
      mockSectorsRepo.find.mockResolvedValue([sector]);
      const queryParams: SectorQueryParams = {
        processtype: 1,
      };

      // Act
      const result = await sectorsService.getSectorsByFilter(queryParams);

      // Assert
      expect(result).toEqual([sector]);
      expect(mockSectorsRepo.find).toHaveBeenCalledWith({
        relations: { processTypes: true },
        where: {},
      });
    });

    it('should return empty array if no sectors match the provided filter', async () => {
      // Arrange
      mockSectorsRepo.find.mockResolvedValue([]);
      const queryParams: SectorQueryParams = {
        processtype: 1,
      };

      // Act
      const result = await sectorsService.getSectorsByFilter(queryParams);

      // Assert
      expect(result).toEqual([]);
      expect(mockSectorsRepo.find).toHaveBeenCalledWith({
        relations: { processTypes: true },
        where: {},
      });
    });


  });

  describe('addComittersToSector', () => {
    let expectedUser: User;
    let existingSector: Sector;
    const sectorID = 'example_sector_id';

    beforeAll(() => {
      expectedUser = {
        id: 1,
        fullname: 'afek lev',
        username: 'afek lev',
        phoneNumber: '0527364455',
        password: '',
        job: {
          id: '',
          name: ''
        },
        role: {
          id: '',
          name: ''
        },
        sectors: undefined,
        sectors_in_responsibility: undefined
      };

      existingSector = {
        id: sectorID,
        name: 'Example Sector',
        committingUsers: [],
        relatedProcesses: [],
        processTypes: []
      };
    });

    it('should add committing users to a sector', async () => {
      // Arrange
      const data = { userIds: [1, 2, 3] };

      jest.spyOn(UsersHelper, 'getUserById').mockResolvedValue(expectedUser);
      mockSectorsRepo.findOne.mockResolvedValue(existingSector);
      mockSectorsRepo.save.mockResolvedValue(existingSector);

      // Act
      const result = await sectorsService.addComittersToSector(sectorID, data);

      // Assert
      expect(mockSectorsRepo.findOne).toHaveBeenCalledWith({ where: { id: sectorID } });
      expect(UsersHelper.getUserById).toHaveBeenCalledTimes(data.userIds.length);
      expect(mockSectorsRepo.save).toHaveBeenCalled();
      expect(result.committingUsers).toHaveLength(data.userIds.length);
    });

    it('should handle case when committingUsersIds is not provided', async () => {
      // Arrange
      const data = { userIds: [] };

      mockSectorsRepo.findOne.mockResolvedValue(existingSector);
      mockSectorsRepo.save.mockResolvedValue(existingSector);

      // Act
      const result = await sectorsService.addComittersToSector(sectorID, data);

      // Assert
      expect(mockSectorsRepo.findOne).toHaveBeenCalledWith({ where: { id: sectorID } });
      expect(result.committingUsers).toHaveLength(0);
    });

    it('should throw an error if the sector does not exist', async () => {
      // Arrange
      const sectorID = 'non_existent_sector_id';
      const data = { userIds: [1, 2, 3] };

      mockSectorsRepo.findOne.mockRejectedValue(new Error());

      // Act + Assert
      await expect(sectorsService.addComittersToSector(sectorID, data)).rejects.toThrowError();
    });
  });

  describe('addResponsiblesToSector', () => {
    let expectedUser: User;

    beforeAll(() => {
      expectedUser = {
        id: 1,
        fullname: 'afek lev',
        username: 'afek lev',
        phoneNumber: '0527364455',
        password: '',
        job: {
          id: '',
          name: ''
        },
        role: {
          id: '',
          name: ''
        },
        sectors: undefined,
        sectors_in_responsibility: undefined
      };
    });

    it('should add responsible users to a sector', async () => {
      // Arrange 
      const sectorID = 'example_sector_id';
      const data = { userIds: [1, 2, 3] };
      const existingSector: Sector = {
        id: sectorID,
        name: 'Example Sector',
        committingUsers: [],
        relatedProcesses: [],
        processTypes: [],
        responsibleUsers: []
      };

      jest.spyOn(UsersHelper, 'getUserById').mockResolvedValue(expectedUser);
      mockSectorsRepo.findOne.mockResolvedValue(existingSector);
      mockSectorsRepo.save.mockResolvedValue(existingSector);

      // Act
      const result = await sectorsService.addResponsiblesToSector(sectorID, data);

      // Assert
      expect(mockSectorsRepo.findOne).toHaveBeenCalledWith({ where: { id: sectorID } });
      expect(UsersHelper.getUserById).toHaveBeenCalledTimes(data.userIds.length);
      expect(mockSectorsRepo.save).toHaveBeenCalled();
      expect(result.responsibleUsers).toHaveLength(data.userIds.length);
    });

    it('should handle case when responsibleUsersIds is not provided', async () => {
      // Arrange
      const sectorID = 'example_sector_id';
      const data = { userIds: [] };
      const existingSector: Sector = {
        id: sectorID,
        name: 'Example Sector',
        committingUsers: [],
        relatedProcesses: [],
        processTypes: []
      };

      mockSectorsRepo.findOne.mockResolvedValue(existingSector);
      mockSectorsRepo.save.mockResolvedValue(existingSector);

      // Act
      const result = await sectorsService.addResponsiblesToSector(sectorID, data);

      // Assert
      expect(mockSectorsRepo.findOne).toHaveBeenCalledWith({ where: { id: sectorID } });
      expect(mockSectorsRepo.save).not.toHaveBeenCalled();
      expect(result.responsibleUsers).toHaveLength(0);
    });

    it('should throw an error if the sector does not exist', async () => {
      // Arrange
      const sectorID = 'non_existent_sector_id';
      const data = { userIds: [1, 2, 3] };

      mockSectorsRepo.findOne.mockRejectedValue(new Error());

      // Act + Assert
      await expect(sectorsService.addResponsiblesToSector(sectorID, data)).rejects.toThrowError();
    });
  });

  describe('deleteSector', () => {
    it('should delete the sector and return the deleted sector', async () => {
      // Arrange
      const sectorID = 'example_sector_id';

      const existingSector: Sector = {
        id: sectorID,
        name: 'Example Sector',
        committingUsers: [],
        relatedProcesses: [],
        processTypes: []
      };

      mockSectorsRepo.findOne.mockResolvedValue(existingSector);
      mockSectorsRepo.remove.mockResolvedValue(existingSector);

      // Act
      const result = await sectorsService.deleteSector(sectorID);

      // Assert
      expect(mockSectorsRepo.findOne).toHaveBeenCalledWith({ where: { id: sectorID } });
      expect(mockSectorsRepo.remove).toHaveBeenCalledWith(existingSector);
      expect(result).toEqual(existingSector);
    });

    it('should throw an error if the sector does not exist', async () => {
      // Arrange
      const sectorID = 'non_existent_sector_id';

      mockSectorsRepo.findOne.mockRejectedValue(new Error());

      // Act + Assert
      await expect(sectorsService.deleteSector(sectorID)).rejects.toThrowError();
    });
  });
});

