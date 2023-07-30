import { Test, TestingModule } from '@nestjs/testing';
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';
import { SectorCreationParams, SectorPatchAddResponsiblesParams, SectorPatchAddUsersParams, SectorPatchParams } from '@checkout/types';

describe('SectorsController', () => {
  let controller: SectorsController;
  let service: SectorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectorsController],
      providers: [
        {
          provide: SectorsService,
          useValue: {
            // Mock or stub the methods of SectorsService that the controller uses
            getAllSectors: jest.fn().mockResolvedValue([
              { id: 1, name: 'Sector A' },
              { id: 2, name: 'Sector B' },
            ]),
            getSector: jest.fn().mockImplementation((id: number) => {
              return { id, name: `Sector ${id}` };
            }),
            getSectorsByFilter: jest.fn().mockResolvedValue([
              { id: 1, name: 'Sector A' },
            ]),
            addSector: jest.fn().mockImplementation((data: SectorCreationParams) => {
              return { id: 3, ...data };
            }),
            updateSector: jest.fn().mockImplementation((id: number, data: SectorPatchParams) => {
              return { id: id, ...data };
            }),
            addComittersToSector: jest.fn().mockImplementation((id: number, data: SectorPatchAddUsersParams) => {
              return { id: id, committers: (data as any).users };
            }),
            addResponsiblesToSector: jest.fn().mockImplementation((id: number, data: SectorPatchAddResponsiblesParams) => {
              return { id: id, responsibles: (data as any).responsibles };
            }),
            deleteSector: jest.fn().mockImplementation((id: number) => {
              return { id, name: `Sector ${id}` };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SectorsController>(SectorsController);
    service = module.get<SectorsService>(SectorsService);
  });

  describe('getAllSectors', () => {
    it('should return an array of sectors', async () => {
      const result = await controller.getAllSectors();
      expect(result).toEqual([
        { id: 1, name: 'Sector A' },
        { id: 2, name: 'Sector B' },
      ]);
    });
  });

  describe('getSector', () => {
    it('should return a sector by ID', async () => {
      const result = await controller.getSector({ sectorID: 1 });
      expect(result).toEqual({ id: 1, name: 'Sector 1' });
    });

    it('should call getSector method with correct ID', async () => {
      await controller.getSector({ sectorID: 1 });
      expect(service.getSector).toHaveBeenCalledWith(1);
    });
  });

  describe('getSectorsByFilter', () => {
    it('should return an array of sectors based on query params', async () => {
      const queryParams = { name: 'A' };
      const result = await controller.getSectorsByFilter(queryParams as any);
      expect(result).toEqual([{ id: 1, name: 'Sector A' }]);
    });
  });

  describe('addSector', () => {
    it('should add a new sector and return the added sector', async () => {
      const sectorData = { name: 'New Sector' };
      const result = await controller.addSector(sectorData);
      expect(result).toEqual({ id: 3, name: 'New Sector' });
    });
  });

  describe('updateSector', () => {
    it('should update a sector and return the updated sector', async () => {
      const sectorPatchData = { name: 'Updated Sector' };
      const result = await controller.updateSector({sectorID : 1}, sectorPatchData);
      expect(result).toEqual({ id: 1, name: 'Updated Sector' });
    });
  });

  describe('addCommittersToSector', () => {
    it('should add committers to a sector and return the updated sector', async () => {
      const committersData = { users: ['user1', 'user2'] };
      const result = await controller.addCommittersToSector({sectorID : 1}, committersData as any);
      expect(result).toEqual({ id: 1, committers: ['user1', 'user2'] });
    });
  });

  describe('addResponsiblesToSector', () => {
    it('should add responsibles to a sector and return the updated sector', async () => {
      const responsiblesData = { responsibles: ['user3', 'user4'] };
      const result = await controller.addResponsiblesToSector({sectorID : 1}, responsiblesData as any);
      expect(result).toEqual({ id: 1, responsibles: ['user3', 'user4'] });
    });
  });

  describe('deleteSector', () => {
    it('should delete a sector and return the deleted sector', async () => {
      const result = await controller.deleteSector({ sectorID: 1 });
      expect(result).toEqual({ id: 1, name: 'Sector 1' });
    });
  });
});
