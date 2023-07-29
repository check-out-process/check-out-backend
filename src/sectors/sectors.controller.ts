import { Controller, Get, Param, Body, Post, Delete, Patch, Query } from '@nestjs/common';
import { SectorCreationParams, SectorPatchAddResponsiblesParams, SectorPatchAddUsersParams, SectorPatchParams, SectorQueryParams } from '@checkout/types';
import { Sector } from './sectors.entities';
import { SectorsService } from './sectors.service';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('sectors')
@ApiTags('sectors')
@ApiForbiddenResponse({description: 'Forbidden.'})
@ApiNotFoundResponse({description: 'Sector not found'})

export class SectorsController {
    constructor(private sectorsService: SectorsService){}

    @Get()
    public async getAllSectors() : Promise<Sector[]> {
        return await this.sectorsService.getAllSectors();
    }

    @Get(':sectorID')
    @ApiParam({name: 'sectorID', description: 'The id of the sector'})
    public async getSector(@Param() params) : Promise<Sector> {
        let sector: Sector = await this.sectorsService.getSector(params.sectorID);
        return sector
    }

    @Get('/filter')
    public async getSectorsByFilter(@Query() params: SectorQueryParams): Promise<Sector[]>{
        return await this.sectorsService.getSectorsByFilter(params);
    }

    @Post()
    @ApiOkResponse({description: 'Sector created'})
    public async addSector(@Body() data : SectorCreationParams) : Promise<Sector> {
        return await this.sectorsService.addSector(data);
    }

    @Patch(':sectorID')
    @ApiParam({name: 'sectorID', description: 'The id of the sector'})
    @ApiOkResponse({description: 'Sector edited'})
    public async updateSector(
        @Param() params,
        @Body() data: SectorPatchParams ) : Promise<Sector> {
            return await this.sectorsService.updateSector(params.sectorID, data);
    }

    @Patch(':sectorID/add-committers')
    @ApiParam({name: 'sectorID', description: 'The id of the sector'})
    @ApiOkResponse({description: 'Sector edited'})
    public async addCommittersToSector(
        @Param() params,
        @Body() data: SectorPatchAddUsersParams) : Promise<Sector>
        {
            return await this.sectorsService.addComittersToSector(params.sectorID, data);
        }

    @Patch(':sectorID/add-responsibles')
    @ApiParam({name: 'sectorID', description: 'The id of the sector'})
    @ApiOkResponse({description: 'Sector edited'})
    public async addResponsiblesToSector(
        @Param() params,
        @Body() data: SectorPatchAddResponsiblesParams) : Promise<Sector>
        {
            return await this.sectorsService.addResponsiblesToSector(params.sectorID, data);
        }


    @Delete(':sectorID')
    @ApiParam({name: 'sectorID', description: 'The id of the sector'})
    @ApiOkResponse({description: 'Sector Deleted'})
    public async deleteSector(@Param() params) : Promise<Sector> {
        return await this.sectorsService.deleteSector(params.sectorID);
    }

}
