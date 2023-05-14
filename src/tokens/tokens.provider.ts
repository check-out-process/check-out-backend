import {DataSource} from 'typeorm'
import { Token } from './tokens.entities';

export const tokensProviders = [
    {
        provide: 'TOKEN_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Token),
        inject: ['DATA_SOURCE'],
    }
];

