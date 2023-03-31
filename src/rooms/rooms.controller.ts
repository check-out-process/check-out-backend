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

    @Get(':roomID')
    async getRoom(@Param() params): Promise<Room> {
        return await this.roomsService.getRoomByID(params.roomID, params.departmentId);
    }

    @Post()
    async creatRoom(@Param() params, @Body() data : RoomCreationParams) : Promise<Room> {
        return await this.roomsService.createRoom(params.departmentId, data);
    }

    @Patch(':roomID')
    async updateRoom(
        @Body() data: RoomPatchParams,
        @Param() params) : Promise<Room> {
        return await this.roomsService.updateRoom(params.roomID, params.departmentId, data);
    }

    @Delete(':roomID')
    async deleteRoom(@Param() params) : Promise<Room> {
        return await this.roomsService.deleteRoom(params.roomID, params.departmentId);
    }

}
