import { Controller, Get, Param, Post, Body, Delete, Patch } from '@nestjs/common';
import { BedCreationParams, BedPatchParams } from './beds.dto';
import { Bed } from './beds.entities';
import { BedsService } from './beds.service';

@Controller('beds')
export class BedsController {
    constructor(private bedsService : BedsService) {}

    @Get()
    async getAllBeds() : Promise<Bed[]> {
        return await this.bedsService.getAllBeds();
    }

    @Get(':bedUUID')
    async getBed(@Param() params) : Promise<Bed> {
        return await this.bedsService.getBedByUUID(params.bedUUID);
    }

    @Post()
    async addBed(@Body() data : BedCreationParams) : Promise<Bed> {
        return await this.bedsService.addBed(data);
    }

    @Delete(':bedUUID')
    async deleteBed(@Param() params) : Promise<Bed> {
        return await this.bedsService.deleteBed(params.bedUUID);
    }

    @Patch(':bedUUID')
    async updateBed(@Body() data : BedPatchParams, @Param() params) : Promise<Bed> {
        return await this.bedsService.updateBed(params.bedUUID, data);
    }

}
