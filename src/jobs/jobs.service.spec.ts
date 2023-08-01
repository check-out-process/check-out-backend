import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { Job } from './jobs.entities';
import { Repository } from 'typeorm';

function randomUUID() {
  return 'test-' + Math.random().toString(36).substr(2, 9);
}

describe('JobsService', () => {
  let jobsService: JobsService;
  let jobsRepository: Repository<Job>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: 'JOB_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();

    jobsService = module.get<JobsService>(JobsService);
    jobsRepository = module.get<Repository<Job>>('JOB_REPOSITORY');
  });

  describe('createJob', () => {
    it('should create a job and return it', async () => {
      // Arrange
      const createJobParams = { };

      
      const createdJob = new Job();
      jest.spyOn(jobsRepository, 'create').mockReturnValue(createdJob);
      jest.spyOn(jobsRepository, 'save').mockResolvedValue(createdJob);

      // Act
      const result = await jobsService.createJob(createJobParams as any);

      // Assert
      expect(result).toBe(createdJob);
      expect(jobsRepository.create).toHaveBeenCalledTimes(1);
      expect(jobsRepository.save).toHaveBeenCalledWith(createdJob);
    });
  });

  describe('getJobs', () => {
    it('should return an array of jobs', async () => {
      // Arrange
      const jobs = [new Job(), new Job()];
      jest.spyOn(jobsRepository, 'find').mockResolvedValue(jobs);

      // Act
      const result = await jobsService.getJobs();

      // Assert
      expect(result).toEqual(jobs);
      expect(jobsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getJob', () => {
    it('should return a single job by its ID', async () => {
      // Arrange
      const jobId = randomUUID();
      const job = new Job();
      jest.spyOn(jobsRepository, 'findOne').mockResolvedValue(job);

      // Act
      const result = await jobsService.getJob(jobId);

      // Assert
      expect(result).toBe(job);
      expect(jobsRepository.findOne).toHaveBeenCalledWith({ where: { id: jobId } });
    });

    it('should return undefined if the job does not exist', async () => {
      // Arrange
      const jobId = randomUUID();
      jest.spyOn(jobsRepository, 'findOne').mockResolvedValue(undefined);

      // Act
      const result = await jobsService.getJob(jobId);

      // Assert
      expect(result).toBeUndefined();
      expect(jobsRepository.findOne).toHaveBeenCalledWith({ where: { id: jobId } });
    });
  });
});
