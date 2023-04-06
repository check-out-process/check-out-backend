import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { Sector } from './sectors.entities';
import { SectorCreationParams, SectorPatchAddUserParams, SectorPatchParams } from './sectors.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entities';
import { UsersHelper } from 'src/users/users.helper';

@Injectable()
export class SectorsService {

    constructor(
        @Inject('SECTOR_REPOSITORY')
        private sectorsRepo: Repository<Sector>,
    ) {}

    public async getAllSectors() : Promise<Sector[]> {
        return await this.sectorsRepo.find();
    }

    public async getSector(sectorID : string) : Promise<Sector> {
        try{
            return await this.sectorsRepo.findOne({where : {ID: sectorID}})
        }
        catch{
            //ToDo: throw err
        }
    }

    public async addSector(data : SectorCreationParams) : Promise<Sector> {
        let newSector : Sector = this.sectorsRepo.create()
        const parameters : string[] = Object.keys(data);
        parameters.forEach((parameter) => {
            newSector[parameter] = data[parameter];
        });
        newSector.ID = randomUUID();
        this.sectorsRepo.save(newSector);
        return newSector;
    }

    public async updateSector(sectorID: string, data : SectorPatchParams) : Promise<Sector> {
        let sectorToUpdate : Sector = await this.getSector(sectorID);
        const parameters : string[] = Object.keys(data);
        parameters.forEach((parameter) => {
            sectorToUpdate[parameter] = data[parameter] //typeof(data[parameter]) == typeof(Array) ? this.convertArrayToString(data[parameter]) : data[parameter];
        });
        this.sectorsRepo.save(sectorToUpdate);
        return sectorToUpdate;
    }

    public async addComitterToSector(sectorID: string, data: SectorPatchAddUserParams): Promise<Sector> {
        let sectorToUpdate : Sector = await this.getSector(sectorID);
        const user: User = await UsersHelper.getUserById(data.userId);
        (await sectorToUpdate.commitersUsers).push(user);
        return this.sectorsRepo.save(sectorToUpdate);
    }   

    public async deleteSector(sectorID: string) : Promise<Sector> {
        let sectorToDelete : Sector = await this.getSector(sectorID);
        try{
            await this.sectorsRepo.remove(sectorToDelete);
            return sectorToDelete;
        }
        catch{
            //ToDo: throw err
        }
    }

    private convertArrayToString(array: number[] | string[]) : string{
        let converted: string = array.join(',');
        return converted;
    }

    private convertStringToNumbersArray(stringToConvert: string) : number[] {
        let array : number[] = stringToConvert.split(',').map(Number);
        return array;
    }
}
