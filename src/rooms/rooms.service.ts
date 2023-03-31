import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Room } from './rooms.entities';
import { RoomCreationParams, RoomPatchParams } from './rooms.dto';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import * as _ from 'lodash';

@Injectable()
export class RoomsService {
    constructor(
        @Inject('ROOM_REPOSITORY')
        private roomsRepo: Repository<Room>
    ) {}

    public async getAllRooms() : Promise<Room[]> {
        return this.roomsRepo.find();
    }

    public async getAllRoomsOfDepartment(depID: number) : Promise<Room[]>{
        const rooms : Room[] = await this.roomsRepo.find({
            where : {
                departmentId: depID
            }
        })
        if (_.isEmpty(rooms) || _.isNull(rooms)){
            this.throwNotFoundException(`Department (ID: ${depID}) has no rooms`);
        }
        else{
            return rooms;
        }
    }

    public async getRoomByUUID(uuid: string) : Promise<Room>{
        const roomSelected : Room = await this.roomsRepo.findOne({
            where: {
                UUID: uuid
            }
        });
        if (!roomSelected){
            this.throwNotFoundException("Room Not Found")
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

    private throwNotFoundException(message: string) {
        throw new HttpException(message, HttpStatus.NOT_FOUND);   
    }
}
