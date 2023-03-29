import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ROOMS } from './rooms.mock';
import { Room } from './rooms.entities';
import { RoomCreationParams, RoomPatchParams } from './rooms.dto';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
    private rooms: Room[] = ROOMS;
    constructor(
        @Inject('ROOM_REPOSITORY')
        private roomsRepo: Repository<Room>
    ) {}

    public async getAllRooms() : Promise<Room[]> {
        return this.roomsRepo.find();
    }

    public async getRoomByUUID(uuid: string) : Promise<Room>{
        const roomSelected = this.rooms.find((room) => {
            room.UUID = uuid;
        })
        if (!roomSelected){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return roomSelected;
    }

    public async createRoom(roomDetails: RoomCreationParams) : Promise<Room> {
        let newRoom : Room = new Room();
        const parameters : string[] = Object.keys(roomDetails);
        parameters.forEach((parameter) => {
            newRoom[parameter] = roomDetails[parameter];
        });
        newRoom.UUID = randomUUID();
        this.roomsRepo.save(newRoom);
        return newRoom;
    }

    public async updateRoom(uuid: string, roomDetails: RoomPatchParams) : Promise<Room> {
        const roomIndex : number = this.rooms.findIndex((room) => room.UUID === uuid);
        if (roomIndex == -1){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        let newRoom : Room = this.rooms[roomIndex];
        const parametersChanged : string[] = Object.keys(roomDetails);
        parametersChanged.forEach((parameter) => {
            newRoom[parameter] = roomDetails[parameter];
        })
        this.rooms[roomIndex] = newRoom;
        return newRoom;
    }

    public async deleteRoom(uuid: string) : Promise<Room> {
        const roomIndex = this.rooms.findIndex((room) => 
            room.UUID === uuid);
        if (roomIndex == -1){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const deletedRoom = this.rooms[roomIndex];
        this.rooms.splice(roomIndex, 1);
        return deletedRoom;
    }
}
