import { Controller, Get, Param, Body, Post, Delete, Patch } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './rooms.entities';
import { RoomCreationParams, RoomPatchParams } from '@checkout/types';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('/departments/:departmentId/rooms')
@ApiTags('rooms')
@ApiNotFoundResponse({description: 'Room not found'})
@ApiForbiddenResponse({description: 'Forbidden.'})
export class RoomsController {
    constructor(private roomsService: RoomsService){}

    @Get()
    @ApiParam({name: 'departmentId', description: 'Id of the department'})
    async getAllRooms(@Param() params){
        return await this.roomsService.getAllRoomsOfDepartment(params.departmentId);
    }

    @Get(':roomID')
    @ApiParam({name: 'departmentId', description: 'Id of the department'})
    @ApiParam({name: 'roomID', description: 'The id of the room'})
    async getRoom(@Param() params): Promise<Room> {
        return await this.roomsService.getRoomByID(params.roomID);
    }

    @Post()
    @ApiParam({name: 'departmentId', description: 'Id of the department'})
    @ApiOkResponse({description: 'Room created'})
    async creatRoom(@Param() params, @Body() data : RoomCreationParams) : Promise<Room> {
        return await this.roomsService.createRoom(params.departmentId, data);
    }

    @Patch(':roomID')
    @ApiParam({name: 'departmentId', description: 'Id of the department'})
    @ApiParam({name: 'roomID', description: 'The id of the room'})
    @ApiOkResponse({description: 'Room edited'})
    async updateRoom(
        @Body() data: RoomPatchParams,
        @Param() params) : Promise<Room> {
        return await this.roomsService.updateRoom(params.roomID, params.departmentId, data);
    }

    @Delete(':roomID')
    @ApiParam({name: 'departmentId', description: 'Id of the department'})
    @ApiParam({name: 'roomID', description: 'The id of the room'})
    @ApiOkResponse({description: 'Room deleted'})
    async deleteRoom(@Param() params) : Promise<Room> {
        return await this.roomsService.deleteRoom(params.roomID, params.departmentId);
    }

}
