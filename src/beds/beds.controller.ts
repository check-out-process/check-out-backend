import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BedCreationParams } from './beds.dto';
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
    async addBed(@Body() body : BedCreationParams) : Promise<Bed> {
        return await this.bedsService.addBed(body);
    }

}
