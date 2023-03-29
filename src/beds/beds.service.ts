import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { BedCreationParams } from './beds.dto';
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
        this.bedRepo.save(newBed);
        return newBed;
    }
}
