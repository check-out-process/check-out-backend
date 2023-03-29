import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ROOMS } from './rooms.mock';
import { Room } from './rooms.entities';
import { RoomCreationParams, RoomPatchParams } from './rooms.dto';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { rootCertificates } from 'tls';

@Injectable()
export class RoomsService {
    constructor(
        @Inject('ROOM_REPOSITORY')
        private roomsRepo: Repository<Room>
    ) {}

    public async getAllRooms() : Promise<Room[]> {
        return this.roomsRepo.find();
    }

    public async getRoomByUUID(uuid: string) : Promise<Room>{
        const roomSelected : Room = await this.roomsRepo.findOne({
            where: {
                UUID: uuid
            }
        });
        if (!roomSelected){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return roomSelected;
    }

    public async createRoom(roomDetails: RoomCreationParams) : Promise<Room> {
        let newRoom : Room = this.roomsRepo.create()
        const parameters : string[] = Object.keys(roomDetails);
        parameters.forEach((parameter) => {
            newRoom[parameter] = roomDetails[parameter];
        });
        newRoom.UUID = randomUUID();
        this.roomsRepo.save(newRoom);
        return newRoom;
    }

    public async updateRoom(uuid: string, roomUpdatedDetails: RoomPatchParams) : Promise<Room> {
        let room : Room = await this.getRoomByUUID(uuid);
        const parameters : string[] = Object.keys(roomUpdatedDetails);
        parameters.forEach((parameter) => {
            room[parameter] = roomUpdatedDetails[parameter]
        });
        this.roomsRepo.save(room);
        return room;
    }

    public async deleteRoom(uuid: string) : Promise<Room> {
        const roomToDelete : Room = await this.getRoomByUUID(uuid);
        this.roomsRepo.delete(roomToDelete);
        return roomToDelete;    
    }
}
