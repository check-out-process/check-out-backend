import { CreateProcessInstanceFromDataParams, NewSectorInstanceData, Status } from '@checkout/types';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Bed } from 'src/beds/beds.entities';
import { BedsHelper } from 'src/beds/beds.helper';
import { ProcessType } from 'src/process-templates/process-templates.entities';
import { ProcessTemplatesService } from 'src/process-templates/process-templates.service';
import { Sector } from 'src/sectors/sectors.entities';
import { SectorsHelper } from 'src/sectors/sectors.helper';
import { User } from 'src/users/users.entities';
import { UsersHelper } from 'src/users/users.helper';
import { Repository } from 'typeorm';
import { ProcessInstance} from './process-instances.entities';
import { SectorInstance } from './sector-instance.entities';
import { ProcessTemplatesHelper } from 'src/process-templates/process-templates.helper';


@Injectable()
export class ProcessInstancesService {
    constructor(
        @Inject('PROCESS_INSTANCE_REPOSITORY')
        private processInstanceRepo: Repository<ProcessInstance>,

        @Inject('SECTOR_INSTANCE_REPOSITORY')
        private sectorInstanceRepo: Repository<SectorInstance>
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

    public async createProcessInstanceFromData(data: CreateProcessInstanceFromDataParams): Promise<ProcessInstance>{
        let processInstance: ProcessInstance = this.processInstanceRepo.create();
        let sectorInstances: SectorInstance[] = [];
        let orderedSectorInstances: string[] = [];
        const bed: Bed = await BedsHelper.getBedById(data.departmentId, data.roomId, data.bedId);

        for (let i = 0; i<data.orderedSectors.length; i++){
            const sectorInstanceData: NewSectorInstanceData = data.orderedSectors[i];
            const newSectorInstance = await this.createSectorInstance(sectorInstanceData, bed);
            sectorInstances.push(newSectorInstance);
            orderedSectorInstances.push(newSectorInstance.instanceId);
        }

        const processType: ProcessType = await ProcessTemplatesHelper.getProcessTypeById(data.processType)
        const creator: User = await UsersHelper.getUserById(data.creatorId);
        processInstance.bed = bed;
        processInstance.instanceId = randomUUID();
        processInstance.sectorsOrder = orderedSectorInstances;
        processInstance.sectorInstances = sectorInstances;
        processInstance.creator = creator;
        processInstance.name = data.name;
        processInstance.description = data.description;
        processInstance.processType = processType;
        
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

    private async createSectorInstance(data: NewSectorInstanceData, bed: Bed): Promise<SectorInstance> {
        const commitingWorker : User = await UsersHelper.getUserById(data.workerId);
        const responsiblePerson: User = await UsersHelper.getUserById(data.responsibleUserId);
        const sector: Sector = await SectorsHelper.getSectorById(data.sectorId);
        
        let newSectorInstance: SectorInstance = await this.sectorInstanceRepo.create();
        newSectorInstance.instanceId = randomUUID();
        newSectorInstance.sectorId = data.sectorId;
        newSectorInstance.status = Status.Waiting;
        newSectorInstance.responsiblePerson = responsiblePerson;
        newSectorInstance.commitingWorker = commitingWorker;
        newSectorInstance.bed = bed;
        newSectorInstance.name = sector.name;

        return newSectorInstance;
    }
}
