import { createProcessInstanceFromDataParams, createProcessInstanceFromTemplateParams, newSectorInstanceData, Status } from '@checkout/types';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Bed } from 'src/beds/beds.entities';
import { BedsHelper } from 'src/beds/beds.helper';
import { ProcessTemplate, ProcessType } from 'src/process-templates/processes.entities';
import { ProcessTemplatesService } from 'src/process-templates/processes.service';
import { Sector } from 'src/sectors/sectors.entities';
import { SectorsHelper } from 'src/sectors/sectors.helper';
import { User } from 'src/users/users.entities';
import { UsersHelper } from 'src/users/users.helper';
import { Repository } from 'typeorm';
import { ProcessInstance, SectorInstance } from './process-instances.entities';

@Injectable()
export class ProcessInstancesService {
    constructor(
        @Inject('PROCESS_INSTANCE_REPOSITORY')
        private processInstanceRepo: Repository<ProcessInstance>,

        @Inject('SECTOR_INSTANCE_REPOSITORY')
        private sectorInstanceRepo: Repository<SectorInstance>,

        private processTemplatesService: ProcessTemplatesService
    ){}

    public async getAllProcessInstances(): Promise<ProcessInstance[]>{
        return await this.processInstanceRepo.find();
    }

    public async getAllSectorInstances(): Promise<SectorInstance[]> {
        return await this.sectorInstanceRepo.find();
    }

    public async getProcessInstance(id: string): Promise<ProcessInstance> {
        return await this.processInstanceRepo.findOne({where: {instanceId: id}});
    }

    public async getSectorInstance(id: string): Promise<SectorInstance> {
        return await this.sectorInstanceRepo.findOne({where: {instanceId: id}});
    }

    public async getSectorInstancesOfProcess(processId: string): Promise<SectorInstance[]> {
        const procInstance = await this.processInstanceRepo.findOne({where: {instanceId: processId}});
        const sectorInstances = procInstance.sectorInstances;
        return sectorInstances;
    }

    public async createProcessInstanceFromData(data: createProcessInstanceFromDataParams): Promise<ProcessInstance>{
        let processInstance: ProcessInstance = this.processInstanceRepo.create();
        let sectorInstances: SectorInstance[] = [];
        let orderedSectorInstances: string[] = [];
        const bed: Bed = await BedsHelper.getBedById(data.departmentId, data.roomId, data.bedId);
        data.ordered_sectors.forEach(async (newInstanceData) => {
            const newSectorInstance = await this.createSectorInstance(newInstanceData, bed);
            sectorInstances.push(newSectorInstance);
            orderedSectorInstances.push(newInstanceData.sector_id);
        })
        const processType: ProcessType = await this.processTemplatesService.getProcessTypeByID(data.processType)
        const creator: User = await UsersHelper.getUserById(data.creator_id);
        processInstance.bed = bed;
        processInstance.instanceId = randomUUID();
        processInstance.sectorsOrder = orderedSectorInstances;
        processInstance.sectorInstances = sectorInstances;
        processInstance.creator = creator;
        processInstance.name = data.name;
        processInstance.description = data.description;
        
        return await this.processInstanceRepo.save(processInstance);

    }

    // public async createProcessInstanceFromTemplate(data: createProcessInstanceFromTemplateParams): Promise<ProcessInstance> {
    //     let processInstance: ProcessInstance = this.processInstanceRepo.create();
    //     processInstance.bed = await BedsHelper.getBedById(data.departmentId, data.roomId, data.bedId)
    //     const processTemplate: ProcessTemplate = await this.processTemplatesService.getProcessById(data.template_id);
    //     processInstance.name = processTemplate.name;
    //     processInstance.description = processTemplate.description;
    //     processInstance.instanceId = randomUUID();
    //     processInstance.sectorsOrder = processTemplate.relatedSectorsOrder;
    //     processTemplate.relatedSectors.forEach(async (sector) => {
    //         const sectorInstance
    //     })
    // }

    private async createSectorInstance(data: newSectorInstanceData, bed: Bed): Promise<SectorInstance> {
        const commitingWorker : User = await UsersHelper.getUserById(data.worker_id);
        const responsiblePerson: User = await UsersHelper.getUserById(data.responsible_user_id);
        const sector: Sector = await SectorsHelper.getSectorById(data.sector_id);
        
        let newSectorInstance: SectorInstance = await this.sectorInstanceRepo.create();
        newSectorInstance.instanceId = randomUUID();
        newSectorInstance.sectorId = data.sector_id;
        newSectorInstance.status = Status.Waiting;
        newSectorInstance.responsiblePerson = responsiblePerson;
        newSectorInstance.commitingWorker = commitingWorker;
        newSectorInstance.bed = bed;
        newSectorInstance.name = sector.sectorName;

        return newSectorInstance;
    }
}
