import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { Sector } from './sectors.entities';
import { SectorCreationParams, SectorPatchAddResponsiblesParams, SectorPatchAddUsersParams, SectorPatchParams, SectorQueryParams } from '@checkout/types';
import { User } from '../users/users.entities';
import { UsersHelper } from '../users/users.helper';
import { ProcessTemplate, ProcessType } from '../process-templates/process-templates.entities';
import { ProcessTemplatesHelper } from '../process-templates/process-templates.helper';

@Injectable()
export class SectorsService {

    constructor(
        @Inject('SECTOR_REPOSITORY')
        private sectorsRepo: Repository<Sector>,
    ) { }

    public async getAllSectors(): Promise<Sector[]> {
        return await this.sectorsRepo.find();
    }

    public async getSector(sectorID: string): Promise<Sector> {
        try {
            const sector = await this.sectorsRepo.findOne({ where: { id: sectorID } })
            return sector;
        }
        catch (error) {
            throw error;
        }
    }

    public async getSectorsByFilter(params: SectorQueryParams): Promise<Sector[]> {
        if (params.processtype) {
            return await this.sectorsRepo.find({
                relations: { processTypes: true },
                where: {}
            })
        }
    }

    public async addSector(data: SectorCreationParams): Promise<Sector> {
        let newSector: Sector = this.sectorsRepo.create()

        newSector.id = randomUUID();
        newSector.name = data.name;
        newSector = await this.updateDefaultUser(newSector, data.defaultResponsibleUserId, 'defaultResponsibleUser');
        newSector = await this.updateDefaultUser(newSector, data.defaultCommittingUsersId, 'defaultCommittingUser');
        newSector = await this.updateProcessTypes(newSector, data.processTypes);
        newSector = await this.updateOfficials(newSector, data.responsibleUsersIds, "responsible");
        newSector = await this.updateOfficials(newSector, data.committingUsersIds, "committer");
        newSector = await this.updateRelatedProcesses(newSector, data.relatedProcessIds);

        return await this.sectorsRepo.save(newSector);
    }

    public async updateSector(sectorID: string, data: SectorPatchParams): Promise<Sector> {
        let sectorToUpdate: Sector = await this.getSector(sectorID);
        if (data.name) {
            sectorToUpdate.name = data.name;
        }
        sectorToUpdate = await this.updateDefaultUser(sectorToUpdate, data.defaultResponsibleUserId, 'defaultResponsibleUser');
        sectorToUpdate = await this.updateDefaultUser(sectorToUpdate, data.defaultCommittingUsersId, 'defaultCommittingUser');
        sectorToUpdate = await this.updateProcessTypes(sectorToUpdate, data.processTypes);
        sectorToUpdate = await this.updateOfficials(sectorToUpdate, data.responsibleUsersIds, "responsible");
        sectorToUpdate = await this.updateOfficials(sectorToUpdate, data.committingUsersIds, "committer");
        sectorToUpdate = await this.updateRelatedProcesses(sectorToUpdate, data.relatedProcessIds);
        return await this.sectorsRepo.save(sectorToUpdate);
    }

    public async addComittersToSector(sectorID: string, data: SectorPatchAddUsersParams): Promise<Sector> {
        let sectorToUpdate: Sector = await this.getSector(sectorID);
        data.userIds.forEach(async (id) => {
            const user: User = await UsersHelper.getUserById(id);
            (await sectorToUpdate.committingUsers).push(user);
        })

        return this.sectorsRepo.save(sectorToUpdate);
    }

    public async addResponsiblesToSector(sectorID: string, data: SectorPatchAddResponsiblesParams): Promise<Sector> {
        let sectorToUpdate: Sector = await this.getSector(sectorID);

        data.userIds.forEach(async (id) => {
            const user: User = await UsersHelper.getUserById(id);
            (await sectorToUpdate.responsibleUsers).push(user);
        })

        return this.sectorsRepo.save(sectorToUpdate);
    }

    public async deleteSector(sectorID: string): Promise<Sector> {
        let sectorToDelete: Sector = await this.getSector(sectorID);

        try {
            await this.sectorsRepo.remove(sectorToDelete);
            return sectorToDelete;
        }
        catch (error) {
            throw error;
        }
    }

    private async updateDefaultUser(sector: Sector, userId: number, key: string): Promise<Sector> {
        if (!userId) {
            return sector;
        }

        const user: User = await UsersHelper.getUserById(userId);
        sector[key] = user;

        return sector;
    }

    private async updateProcessTypes(sector: Sector, processType_ids: number[]): Promise<Sector> {
        if (!processType_ids || _.isEmpty(processType_ids)) {
            return sector
        }

        let processTypes: ProcessType[] = [];
        processTypes = await Promise.all(processType_ids.map(async (processType_id) => {
            return await ProcessTemplatesHelper.getProcessTypeById(processType_id);
        }))
        sector.processTypes = processTypes;

        return sector;
    }

    private async updateOfficials(sector: Sector, usersIds: number[], action: "committer" | "responsible"): Promise<Sector> {
        if (!usersIds) return sector;

        let users: User[] = [];
        users = await Promise.all(usersIds.map(async (id) => {
            return await UsersHelper.getUserById(id);
        }))

        switch (action) {
            case 'committer':
                sector.committingUsers = users;
                break;
            case 'responsible':
                sector.responsibleUsers = users;
                break;
        }

        return sector;
    }

    private async updateRelatedProcesses(sector: Sector, processTemplatesIds: string[]): Promise<Sector> {
        if (!processTemplatesIds) return sector;

        let relatedProcesses: ProcessTemplate[] = [];
        relatedProcesses = await Promise.all(processTemplatesIds.map(async (id) => {
            return await ProcessTemplatesHelper.getProcessTemplateById(id)
        }))
        sector.relatedProcesses = relatedProcesses;

        return sector;
    }

}
