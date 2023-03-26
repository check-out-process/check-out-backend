import { Controller, Get, Param, Body, Post, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './rooms.entities';
import { RoomCreationParams, RoomPatchParams } from './rooms.dto';
import { Patch } from '@nestjs/common/decorators';

@Controller('rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService){}

    @Get()
    async getAllRooms(){
        return await this.roomsService.getAllRooms();
    }

    @Get(':roomUUID')
    async getRoom(@Param() params): Promise<Room> {
        return await this.roomsService.getRoomByUUID(params.roomUUID);
    }

    @Post()
    async creatRoom(@Body() data : RoomCreationParams) : Promise<Room> {
        return await this.roomsService.createRoom(data);
    }

    @Patch(':roomUUID')
    async updateRoom(
        @Body() data: RoomPatchParams,
        @Param() params) : Promise<Room> {
        return await this.roomsService.updateRoom(params.roomUUID, data);
    }

    @Delete(':roomUUID')
    async deleteRoom(@Param() params) : Promise<Room> {
        return await this.roomsService.deleteRoom(params.roomUUID);
    }

}
