import { Controller, Get, Param, Body, Post, Delete, Patch, Query } from '@nestjs/common';
import { SectorCreationParams, SectorPatchAddResponsiblesParams, SectorPatchAddUsersParams, SectorPatchParams, SectorQueryParams } from '@checkout/types';
import { Sector } from './sectors.entities';
import { SectorsService } from './sectors.service';

@Controller('sectors')
export class SectorsController {
    constructor(private sectorsService: SectorsService){}

    @Get()
    public async getAllSectors() : Promise<Sector[]> {
        return await this.sectorsService.getAllSectors();
    }

    @Get(':sectorID')
    public async getSector(@Param() params) : Promise<Sector> {
        let sector: Sector = await this.sectorsService.getSector(params.sectorID);
        return sector
    }

    @Get('/filter')
    public async getSectorsByFilter(@Query() params: SectorQueryParams): Promise<Sector[]>{
        return await this.sectorsService.getSectorsByFilter(params);
    }

    @Post()
    public async addSector(@Body() data : SectorCreationParams) : Promise<Sector> {
        return await this.sectorsService.addSector(data);
    }

    // @Patch(':sectorID')
    // public async updateSector(
    //     @Param() params,
    //     @Body() data: SectorPatchParams | SectorPatchAddUserParams) : Promise<Sector> {
    //         if (data instanceof SectorPatchParams){
    //             return await this.sectorsService.updateSector(params.sectorID, data);
    //         }
    //         else if (data instanceof SectorPatchAddUserParams){
    //             return await this.sectorsService.addComitterToSector(params.sectorID, data);
    //         }
    //         else{
    //             console.log("error");
    //             return null
    //         }
    // }

    @Patch(':sectorID')
    public async updateSector(
        @Param() params,
        @Body() data: SectorPatchParams ) : Promise<Sector> {
            return await this.sectorsService.updateSector(params.sectorID, data);
    }

    @Patch(':sectorID/add-committers')
    public async addCommittersToSector(
        @Param() params,
        @Body() data: SectorPatchAddUsersParams) : Promise<Sector>
        {
            return await this.sectorsService.addComittersToSector(params.sectorID, data);
        }

    @Patch(':sectorID/add-responsibles')
    public async addResponsiblesToSector(
        @Param() params,
        @Body() data: SectorPatchAddResponsiblesParams) : Promise<Sector>
        {
            return await this.sectorsService.addResponsiblesToSector(params.sectorID, data);
        }


    @Delete(':sectorID')
    public async deleteSector(@Param() params) : Promise<Sector> {
        return await this.sectorsService.deleteSector(params.sectorID);
    }

}
