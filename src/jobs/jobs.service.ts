import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Job } from './jobs.entities';
import { CreateJobParams } from '@checkout/types';
import { createOrUpdateObjectFromParams } from '../common/utils';
import { randomUUID } from 'crypto';

@Injectable()
export class JobsService {
    constructor(
        @Inject('JOB_REPOSITORY')
        private jobsRepository: Repository<Job>
    ){}

    public async createJob(data: CreateJobParams): Promise<Job>{
        let job: Job = this.jobsRepository.create();
        job = createOrUpdateObjectFromParams(job, data);
        job.id = randomUUID()
        return await this.jobsRepository.save(job);
    }

    public async getJobs(): Promise<Job[]>{
        return await this.jobsRepository.find();
    }

    public async getJob(id: string): Promise<Job>{
        return await this.jobsRepository.findOne({where: {id: id}});
    }
}
