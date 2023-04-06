import { Controller, Get, Param, Body, Post, Delete, Patch } from '@nestjs/common';
import { SectorCreationParams, SectorPatchAddUserParams, SectorPatchParams } from './sectors.dto';
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
        await sector.commitersUsers;
        return sector
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

    @Patch(':sectorID/add-committer')
    public async addCommitterToSector(
        @Param() params,
        @Body() data: SectorPatchAddUserParams) : Promise<Sector>
        {
            return await this.sectorsService.addComitterToSector(params.sectorID, data);
        }

    @Delete('sectorID')
    public async deleteSector(@Param() params) : Promise<Sector> {
        return await this.sectorsService.deleteSector(params.sectorID);
    }

}
