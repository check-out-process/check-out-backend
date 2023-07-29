import { Controller, Get, Param, Post, Body, Delete, Patch } from '@nestjs/common';
import { BedCreationParams, BedPatchParams } from '@checkout/types';
import { Bed } from './beds.entities';
import { BedsService } from './beds.service';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('beds')
@ApiTags('beds')
@ApiNotFoundResponse({description: 'Bed not found'})
@ApiForbiddenResponse({description: 'Forbidden.'})
export class BedsController {
    constructor(private bedsService : BedsService) {}

    @Get('/room/:roomId')
    @ApiParam({name: 'roomId', description: 'Id of room'})
    async getAllBeds(@Param() params) : Promise<Bed[]> {
        return await this.bedsService.getAllBedsOfRoom(params.roomId);
    }

    @Get(':bedID')
    @ApiParam({name: 'bedID', description: 'Id of bed'})
    async getBed(@Param() params) : Promise<Bed> {
        return await this.bedsService.getBedByID(params.bedID);
    }

    @Post()
    @ApiOkResponse({description: 'Bed created'})
    async addBed(@Body() data : BedCreationParams, @Param() params) : Promise<Bed> {
        return await this.bedsService.addBed(params.roomId, params.departmentId, data);
    }

    @Delete(':bedID')
    @ApiParam({name: 'bedID', description: 'Id of bed'})
    @ApiOkResponse({description: 'Bed deleted'})
    async deleteBed(@Param() params) : Promise<Bed> {
        return await this.bedsService.deleteBed(params.bedID, params.roomId);
    }

    @Patch(':bedID')
    @ApiParam({name: 'bedID', description: 'Id of bed'})
    @ApiOkResponse({description: 'Bed edited'})
    async updateBed(@Body() data : BedPatchParams, @Param() params) : Promise<Bed> {
        return await this.bedsService.updateBed(params.bedID, params.roomId, data);
    }

}
