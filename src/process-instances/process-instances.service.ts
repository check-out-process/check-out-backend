import { CreateProcessInstanceFromDataParams, GetProcessInstanceStatusParams, NewSectorInstanceData, ProcessInstanceStatusReturnedParams, Status, UpdateSectorStatusParams } from '@checkout/types';
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
import { DepartmentsHelper } from 'src/department/department.helper';
import { RoomsHelper } from 'src/rooms/rooms.helper';
import { log } from 'console';
import { RolesHelper } from 'src/roles/roles.helper';


@Injectable()
export class ProcessInstancesService {
    constructor(
        @Inject('PROCESS_INSTANCE_REPOSITORY')
        private processInstanceRepo: Repository<ProcessInstance>,

        @Inject('SECTOR_INSTANCE_REPOSITORY')
        private sectorInstanceRepo: Repository<SectorInstance>
    ){}

    public async getAllProcessInstances(): Promise<ProcessInstance[]>{
        let instances: ProcessInstance[] = await this.processInstanceRepo.find();
        instances = instances.map(instance => {
            instance.sectorInstances = this.orderSectors(instance.sectorInstances, instance.sectorsOrder);
            return instance;
        })
        return instances;
    }

    public async getAllSectorInstances(): Promise<SectorInstance[]> {
        return await this.sectorInstanceRepo.find();
    }

    public async getProcessInstance(id: string): Promise<ProcessInstance> {
        //ToDo: handle exception
        let instance = await this.processInstanceRepo.findOne({where: {instanceId: id}});
        instance.sectorInstances = this.orderSectors(instance.sectorInstances, instance.sectorsOrder);
        return instance;
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
        const bed: Bed = await BedsHelper.getBedById(data.bedId);

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
        processInstance.departmentId = data.departmentId;
        processInstance.roomId = data.roomId;
        
        return await this.processInstanceRepo.save(processInstance);

    }


    public async getProcessStatus(bedId: string, data: GetProcessInstanceStatusParams): Promise<ProcessInstanceStatusReturnedParams> {
        let processStatusData: ProcessInstanceStatusReturnedParams = new ProcessInstanceStatusReturnedParams();
        const processInstance = await this.getProcessInstanceOfBed(bedId);
        processInstance.sectorInstances = this.orderSectors(processInstance.sectorInstances, processInstance.sectorsOrder);

        processStatusData.processInstanceId = processInstance.instanceId;
        processStatusData.name = processInstance.name;
        processStatusData.description = processInstance.description;
        processStatusData.creator = processInstance.creator.fullname;
        processStatusData.department = await DepartmentsHelper.getDepartmentById(processInstance.departmentId);
        processStatusData.room = await RoomsHelper.getRoomById(processInstance.departmentId, processInstance.roomId);
        processStatusData.processStatus = processInstance.status;
        processStatusData.processType = processInstance.processType.name;
        processStatusData.sectorInstances = processInstance.sectorInstances;
        processStatusData.currentSectorInstance = this.getCurrentSectorOfProcessInstanceOfUser(processInstance, data.userId);
        return processStatusData;   
    }

    public async updateProcessStatus(bedId: string, data: UpdateSectorStatusParams): Promise<ProcessInstance> {
        const processInstance: ProcessInstance = await this.getProcessInstance(data.processInstanceId);

        if (processInstance.bed.id != bedId){
            //ToDo: throw exception
            log("process instance not match to bed error")
            return;
        }
        let currentSectorInstance = this.getCurrentSectorOfProcessInstace(processInstance);

        log("current sector instance")

        log(currentSectorInstance.name)
        // change it if there`s a feature of parallel sectors in process
        if (currentSectorInstance.instanceId != data.sectorInstanceId ){
            //ToDo: throw exception
            log("sector instance not match error")
            return;
        }

        if (currentSectorInstance.commitingWorker.id != data.userId && data.userId != currentSectorInstance.responsiblePerson.id){
            //ToDo: throw restricted exception
            log("restricted")
            return;
        }

        this.updateSectorInstanceStatus(currentSectorInstance, data.status);
        log(this.getCurrentSectorOfProcessInstace(processInstance).name)
        this.validateProcessStatus(processInstance);

        return await this.processInstanceRepo.save(processInstance)

    }

    private async getProcessInstanceOfBed(bedId: string): Promise<ProcessInstance> {
        const processInstance = await this.processInstanceRepo.createQueryBuilder("processInstance")
        .leftJoinAndSelect("processInstance.bed", "bed")
        .leftJoinAndSelect("processInstance.sectorInstances", "sectorInstances")
        .leftJoinAndSelect("processInstance.processType", "processType")
        .leftJoinAndSelect("processInstance.creator", "creator")
        .where("bed.id = :bedId", {bedId})
        .getOne()
        //.select("processInstance.instanceId")
        //.getRawOne();

        return processInstance;
        //return await this.processInstanceRepo.findOne({where: {instanceId: processInstance.processInstance_instanceId}});
    }

    private updateSectorInstanceStatus(sectorInstance: SectorInstance, status: Status): void{
        log(typeof(sectorInstance.status))
        log(typeof(status))
        if (sectorInstance.status > status){
            //ToDo: throw exception
            log("status error")
            return
        }

        if (sectorInstance.status == status){
            log("status equal error")
            return;
        }

        sectorInstance.status = status;
        log()
        if (status == Status.Done){
            sectorInstance.endedAt = new Date()
        }
    }

    private getCurrentSectorOfProcessInstace(processInstance: ProcessInstance): SectorInstance{
        let currentSectorInstance: SectorInstance = null;
        for(let instance of processInstance.sectorInstances){
            if (instance.status != Status.Done){
                currentSectorInstance = instance;
                break;
            }
        }
        return currentSectorInstance;
    }
    
    private async getCurrentSectorOfProcessInstanceOfUser(processInstance: ProcessInstance, userId: number): Promise<SectorInstance>{
        let currentSectorInstance: SectorInstance = null;
        let user: User = await UsersHelper.getUserById(userId);
        let isUserAManager: boolean = user.role.name == 'Admin';
        for(let instance of processInstance.sectorInstances){
            if (instance.status != Status.Done && (isUserAManager || instance.commitingWorker.id == userId || instance.responsiblePerson.id == userId)){
                currentSectorInstance = instance;
                break;
            }
        }
        return currentSectorInstance;
    }
    
    private validateProcessStatus(processInstance: ProcessInstance): boolean{

        let isDone: boolean = processInstance.sectorInstances.every(instance => instance.status == Status.Done)
        if(isDone){
            //ToDo: fix bug of server / pc timestamp diff
            processInstance.endedAt = new Date();
            processInstance.status = Status.Done;
        }
        return isDone;
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

    private orderSectors(sectors: SectorInstance[], order: string[]) {
        if (sectors.length != order.length){
            // throw err
        }
        let instancesOrder: string[] = sectors.map(instance => instance.instanceId);
        if (JSON.stringify(instancesOrder) === JSON.stringify(order))
        {
            return sectors;
        }
        let orderedArray: SectorInstance[] = [];
        order.forEach(instanceId => {
            const sector: SectorInstance = sectors.find(sec => sec.instanceId == instanceId)
            if (sector) {orderedArray.push(sector)}
            else {
                // think aboud the exception. maybe internal server error?
            }
        })
        return orderedArray;
    }
}
