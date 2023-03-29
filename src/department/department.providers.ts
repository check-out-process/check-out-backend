import {DataSource} from 'typeorm'
import { Department } from './department.entities'

export const departmentProviders = [
    {
        provide: 'DEPARTMENT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Department),
        inject: ['DATA_SOURCE'],
    }
];