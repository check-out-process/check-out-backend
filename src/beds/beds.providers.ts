import { DataSource } from 'typeorm'
import { Bed } from './beds.entities'

export const bedsProviders = [
    {
        provide: 'BED_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Bed),
        inject: ['DATA_SOURCE'],
    }
];