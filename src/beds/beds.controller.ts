import { Controller, Get, Param, Post, Body, Delete, Patch } from '@nestjs/common';
import { BedCreationParams, BedPatchParams } from './beds.dto';
import { Bed } from './beds.entities';
import { BedsService } from './beds.service';

@Controller(':departmentId/rooms/:roomsId/beds')
export class BedsController {
    constructor(private bedsService : BedsService) {}

    @Get()
    async getAllBeds() : Promise<Bed[]> {
        return await this.bedsService.getAllBeds();
    }

    @Get(':bedID')
    async getBed(@Param() params) : Promise<Bed> {
        return await this.bedsService.getBedByID(params.bedID);
    }

    @Post()
    async addBed(@Body() data : BedCreationParams) : Promise<Bed> {
        return await this.bedsService.addBed(data);
    }

    @Delete(':bedID')
    async deleteBed(@Param() params) : Promise<Bed> {
        return await this.bedsService.deleteBed(params.bedID);
    }

    @Patch(':bedID')
    async updateBed(@Body() data : BedPatchParams, @Param() params) : Promise<Bed> {
        return await this.bedsService.updateBed(params.bedID, data);
    }

}
