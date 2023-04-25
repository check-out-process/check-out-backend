import {DataSource} from 'typeorm'
import { Role } from './roles.entities';

export const rolesProviders = [
    {
        provide: 'ROLE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
        inject: ['DATA_SOURCE'],
    }
];