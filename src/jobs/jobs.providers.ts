import {DataSource} from 'typeorm'
import {Job} from './jobs.entities'

export const jobsProviders = [
    {
        provide: 'JOB_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Job),
        inject: ['DATA_SOURCE'],
    }
];