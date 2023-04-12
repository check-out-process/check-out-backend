import {DataSource} from 'typeorm'
import { ProcessTemplate, ProcessType } from './process-templates.entities'

export const processTemplatesProviders = [
    {
        provide: 'PROCESS_TEMPLATE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ProcessTemplate),
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
