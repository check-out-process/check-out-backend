import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let controller: JobsController;
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            getJobs: jest.fn().mockResolvedValue([
              { id: 1, title: 'Job 1' },
              { id: 2, title: 'Job 2' },
            ]),
            getJob: jest.fn().mockImplementation((jobId) => {
              return { id: 1, title: 'Job 1' };
            }),
            createJob: jest.fn().mockImplementation((data) => {
              return { id: 3, title: data.title };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    jobsService = module.get<JobsService>(JobsService);
  });

  describe('getJobs', () => {
    it('should return an array of jobs', async () => {
      const result = await controller.getJobs();
      expect(result).toEqual([
        { id: 1, title: 'Job 1' },
        { id: 2, title: 'Job 2' },
      ]);
      expect(jobsService.getJobs).toHaveBeenCalled();
    });
  });

  describe('getJobById', () => {
    it('should return a job by ID', async () => {
      const params = { jobId: 1 };
      const result = await controller.getJobById(params);
      expect(result).toEqual({ id: 1, title: 'Job 1' });
      expect(jobsService.getJob).toHaveBeenCalledWith(params.jobId);
    });
  });

  describe('createJob', () => {
    it('should create a new job', async () => {
      const data = { title: 'New Job' };
      const result = await controller.createJob(data as any);
      expect(result).toEqual({ id: 3, title: 'New Job' });
      expect(jobsService.createJob).toHaveBeenCalledWith(data);
    });
  });
});
