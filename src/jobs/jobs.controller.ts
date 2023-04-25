import { Controller, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './jobs.entities';

@Controller('jobs')
export class JobsController {
    constructor(private jobsService: JobsService){}

    @Get()
    public async getJobs(): Promise<Job[]>{
        return await this.jobsService.getJobs();
    }

    @Get(':jobId')
    public async getJobById(@Param() params): Promise<Job>{
        return await this.jobsService.getJob(params.jobId);
    }
}
