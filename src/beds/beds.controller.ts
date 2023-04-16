import { Controller, Get, Param, Post, Body, Delete, Patch } from '@nestjs/common';
import { BedCreationParams, BedPatchParams } from '@checkout/types';
import { Bed } from './beds.entities';
import { BedsService } from './beds.service';

@Controller('/departments/:departmentId/rooms/:roomId/beds')
export class BedsController {
    constructor(private bedsService : BedsService) {}

    @Get()
    async getAllBeds(@Param() params) : Promise<Bed[]> {
        return await this.bedsService.getAllBedsOfRoom(params.roomId);
    }

    @Get(':bedID')
    async getBed(@Param() params) : Promise<Bed> {
        return await this.bedsService.getBedByID(params.bedID);
    }

    @Post()
    async addBed(@Body() data : BedCreationParams, @Param() params) : Promise<Bed> {
        return await this.bedsService.addBed(params.roomId, params.departmentId, data);
    }

    @Delete(':bedID')
    async deleteBed(@Param() params) : Promise<Bed> {
        return await this.bedsService.deleteBed(params.bedID, params.roomId);
    }

    @Patch(':bedID')
    async updateBed(@Body() data : BedPatchParams, @Param() params) : Promise<Bed> {
        return await this.bedsService.updateBed(params.bedID, params.roomId, data);
    }

}
