import { DataSource } from 'typeorm'
import { Room } from './rooms.entities'

export const roomsProviders = [
    {
        provide: 'ROOM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Room),
        inject: ['DATA_SOURCE'],
    }
];