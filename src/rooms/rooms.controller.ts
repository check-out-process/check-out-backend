import { Controller, Get, Param, Body, Post, Delete, Patch } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './rooms.entities';
import { RoomCreationParams, RoomPatchParams } from './rooms.dto';

@Controller(':departmentId/rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService){}

    @Get()
    async getAllRooms(@Param() params){
        return await this.roomsService.getAllRoomsOfDepartment(params.departmentId);
    }

    @Get(':roomUUID')
    async getRoom(@Param() params): Promise<Room> {
        return await this.roomsService.getRoomByUUID(params.roomUUID, params.departmentId);
    }

    @Post()
    async creatRoom(@Param() params, @Body() data : RoomCreationParams) : Promise<Room> {
        return await this.roomsService.createRoom(params.departmentId, data);
    }

    @Patch(':roomUUID')
    async updateRoom(
        @Body() data: RoomPatchParams,
        @Param() params) : Promise<Room> {
        return await this.roomsService.updateRoom(params.roomUUID, params.departmentId, data);
    }

    @Delete(':roomUUID')
    async deleteRoom(@Param() params) : Promise<Room> {
        return await this.roomsService.deleteRoom(params.roomUUID, params.departmentId);
    }

}
