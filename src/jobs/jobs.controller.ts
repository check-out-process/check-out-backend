import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './jobs.entities';
import { CreateJobParams } from '@checkout/types';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('jobs')
@ApiTags('jobs')
@ApiNotFoundResponse({description: 'Job not found'})
@ApiForbiddenResponse({description: 'Forbidden.'})
export class JobsController {
    constructor(private jobsService: JobsService){}

    @Get()
    public async getJobs(): Promise<Job[]>{
        return await this.jobsService.getJobs();
    }

    @Get(':jobId')
    @ApiParam({name: 'jobId', description: 'Id of job'})
    public async getJobById(@Param() params): Promise<Job>{
        return await this.jobsService.getJob(params.jobId);
    }

    @Post()
    @ApiOkResponse({description: 'Job created'})
    public async createJob(@Body() data: CreateJobParams): Promise<Job>{
        return await this.jobsService.createJob(data);
    }
}
