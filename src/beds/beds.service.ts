import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { type } from 'os';
import { QueryFailedError, Repository } from 'typeorm';
import { BedCreationParams, BedPatchParams } from './beds.dto';
import { Bed } from './beds.entities';

@Injectable()
export class BedsService {
    constructor(
        @Inject('BED_REPOSITORY')
        private bedRepo : Repository<Bed>
    ){}
    
    public async getAllBeds() : Promise<Bed[]> {
        return this.bedRepo.find();
    }

    public async getBedByUUID(uuid: string) : Promise<Bed> {
        return this.bedRepo.findOne({
            where: {
                UUID: uuid
            },
        });
    }

    public async addBed(bed : BedCreationParams) : Promise<Bed>{
        let newBed : Bed = this.bedRepo.create();
        const parameters : string[] = Object.keys(bed);
        parameters.forEach((parameter) => {
            newBed[parameter] = bed[parameter];
        });
        newBed.UUID = randomUUID();
        try {
            this.bedRepo.save(newBed);
            return newBed;
        }
        catch(e){
            if (e instanceof QueryFailedError){
                throw new Error("Failed to create bed. Please check that there is no other bed with the same details. " + e.message)
            }
            else {
                throw e;
            }
        }
    }

    public async deleteBed(uuid: string) : Promise<Bed> {
        let bedToDelete : Bed = await this.getBedByUUID(uuid);
        this.bedRepo.delete(bedToDelete);

        return bedToDelete;
    }

    public async updateBed(uuid: string, data : BedPatchParams) : Promise<Bed> {
        let bed = await this.getBedByUUID(uuid);
        const parameters : string[] = Object.keys(data);
        parameters.forEach((parameter) => {
            bed[parameter] = data[parameter];
        });
        this.bedRepo.save(bed);
        return bed;
    }
}
