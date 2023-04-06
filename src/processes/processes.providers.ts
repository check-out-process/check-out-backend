import {DataSource} from 'typeorm'
import { Process, ProcessType } from './processes.entities'

export const processesProviders = [
    {
        provide: 'PROCESS_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Process),
        inject: ['DATA_SOURCE'],
    }
];

export const processTypesProviders = [
    {
        provide: 'PROCESS_TYPE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ProcessType),
        inject: ['DATA_SOURCE'],
    }
];
