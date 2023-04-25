import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Job } from './jobs.entities';

@Injectable()
export class JobsService {
    constructor(
        @Inject('JOB_REPOSITORY')
        private jobsRepository: Repository<Job>
    ){}

    public async getJobs(): Promise<Job[]>{
        return await this.jobsRepository.find();
    }

    public async getJob(id: string): Promise<Job>{
        return await this.jobsRepository.findOne({where: {id: id}});
    }
}
