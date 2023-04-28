import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './jobs.entities';
import { CreateJobParams } from '@checkout/types';

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

    @Post()
    public async createJob(@Body() data: CreateJobParams): Promise<Job>{
        return await this.jobsService.createJob(data);
    }
}
