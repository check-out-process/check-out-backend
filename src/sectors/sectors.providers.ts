import {DataSource} from 'typeorm'
import { Sector } from './sectors.entities'

export const departmentProviders = [
    {
        provide: 'SECTOR_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Sector),
        inject: ['DATA_SOURCE'],
    }
];