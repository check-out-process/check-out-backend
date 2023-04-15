import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { QueryFailedError, Repository } from 'typeorm';
import { BedCreationParams, BedPatchParams } from '@checkout/types';
import { Bed } from './beds.entities';
import * as _ from 'lodash';
import { createOrUpdateObjectFromParams } from 'src/common/utils';

@Injectable()
export class BedsService {
    constructor(
        @Inject('BED_REPOSITORY')
        private bedRepo : Repository<Bed>
    ){}

    public async getBedByID(id: string) : Promise<Bed> {
        return this.bedRepo.findOne({
            where: {
                id: id
            },
        });
    }

    public async getAllBedsOfRoom(roomID: string) : Promise<Bed[]> {
        const beds : Bed[] = await this.bedRepo.find({
            where: {
                roomId: roomID
            }
        });
        if (_.isEmpty(beds) || _.isNull(beds)){
            this.throwNotFoundException(`Room (ID: ${roomID}) has no beds assigned`);
        }
        else {
            return beds;
        }
    }

    public async addBed(roomId: string, departmentId: string, data : BedCreationParams) : Promise<Bed>{
        let newBed : Bed = this.bedRepo.create();
        newBed.roomId = roomId;
        newBed.departmentId = departmentId;
        newBed = createOrUpdateObjectFromParams(newBed, data);
        newBed.id = randomUUID();
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

    public async deleteBed(id: string, roomId: string) : Promise<Bed> {
        let bedToDelete : Bed = await this.getBedByID(id);
        this.bedRepo.delete(bedToDelete);

        return bedToDelete;
    }

    public async updateBed(id: string, roomId: string, data : BedPatchParams) : Promise<Bed> {
        let bed = await this.getBedByID(id);
        bed = createOrUpdateObjectFromParams(bed, data)
        this.bedRepo.save(bed);
        return bed;
    }
    
    private throwNotFoundException(message: string) {
        throw new HttpException(message, HttpStatus.NOT_FOUND);   
    }
}

