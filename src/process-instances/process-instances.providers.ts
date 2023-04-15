import {DataSource} from 'typeorm'
import {ProcessInstance} from './process-instances.entities'
import { SectorInstance } from './sector-instance.entities';

export const processProviders = [
    {
        provide: 'PROCESS_INSTANCE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ProcessInstance),
        inject: ['DATA_SOURCE'],
    }
];

export const sectorInstanceProviders = [
    {
        provide: 'SECTOR_INSTANCE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(SectorInstance),
        inject: ['DATA_SOURCE'],
    }
];