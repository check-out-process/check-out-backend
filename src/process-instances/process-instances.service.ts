import { CreateProcessInstanceFromDataParams, GetProcessInstanceStatusParams, NewSectorInstanceData, ProcessInstanceStatusReturnedParams, Status, UpdateSectorInstanceParams, UpdateSectorStatusParams } from '@checkout/types';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Bed } from 'src/beds/beds.entities';
import { ProcessType } from 'src/process-templates/process-templates.entities';
import { Sector } from 'src/sectors/sectors.entities';
import { User } from 'src/users/users.entities';
import { Repository } from 'typeorm';
import { ProcessInstance } from './process-instances.entities';
import { SectorInstance } from './sector-instance.entities';
import { log } from 'console';
import { DepartmentService } from 'src/department/department.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { BedsService } from 'src/beds/beds.service';
import { UsersService } from 'src/users/users.service';
import { SectorsService } from 'src/sectors/sectors.service';
import { ProcessTemplatesService } from 'src/process-templates/process-templates.service';


@Injectable()
export class ProcessInstancesService {
    constructor(
        @Inject('PROCESS_INSTANCE_REPOSITORY')
        private processInstanceRepo: Repository<ProcessInstance>,

        @Inject('SECTOR_INSTANCE_REPOSITORY')
        private sectorInstanceRepo: Repository<SectorInstance>,
        private departmentService: DepartmentService,
        private roomsService: RoomsService,
        private bedsService: BedsService,
        private usersService: UsersService,
        private sectorsService: SectorsService,
        private processTemplatesService: ProcessTemplatesService
    ) { }

    public async getAllProcessInstances(): Promise<ProcessInstance[]> {
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
        let instance = await this.processInstanceRepo.findOne({ where: { instanceId: id } });
        instance.sectorInstances = this.orderSectors(instance.sectorInstances, instance.sectorsOrder);
        return instance;
    }

    public async getSectorInstance(id: string): Promise<SectorInstance> {
        return await this.sectorInstanceRepo.findOne({ where: { instanceId: id } });
    }

    public async getSectorInstancesOfProcess(processId: string): Promise<SectorInstance[]> {
        const procInstance = await this.processInstanceRepo.findOne({ where: { instanceId: processId } });
        const sectorInstances = procInstance.sectorInstances;
        return sectorInstances;
    }

    public async createProcessInstanceFromData(data: CreateProcessInstanceFromDataParams): Promise<ProcessInstance> {
        let processInstance: ProcessInstance = this.processInstanceRepo.create();
        let sectorInstances: SectorInstance[] = [];
        let orderedSectorInstances: string[] = [];
        const bed: Bed = await this.bedsService.getBedByID(data.bedId);

        for (let i = 0; i < data.orderedSectors.length; i++) {
            const sectorInstanceData: NewSectorInstanceData = data.orderedSectors[i];
            const newSectorInstance = await this.createSectorInstance(sectorInstanceData, bed);
            sectorInstances.push(newSectorInstance);
            orderedSectorInstances.push(newSectorInstance.instanceId);
        }

        const processType: ProcessType = await this.processTemplatesService.getProcessTypeByID(data.processType)
        const creator: User = await this.usersService.getUserById(data.creatorId);
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

        try {
            await this.processInstanceRepo.save(processInstance);
        } catch (error) {
            const a = error;
        }

        return await this.processInstanceRepo.save(processInstance);

    }

    public async updateSectorInstance(data: UpdateSectorInstanceParams, processInstanceId: string, sectorInstanceId: string): Promise<ProcessInstance> {
        let instance = await this.sectorInstanceRepo.findOne({ where: { instanceId: sectorInstanceId } });
        if (data.status) { instance.status = data.status }
        if (data.commitingWorkerId) {
            const worker = await this.usersService.getUserById(data.commitingWorkerId);
            instance.commitingWorker = worker;
        }
        if (data.responsiblePersonId) {
            const responsible = await this.usersService.getUserById(data.responsiblePersonId);
            instance.responsiblePerson = responsible;
        }
        await this.sectorInstanceRepo.save(instance);
        return await this.processInstanceRepo.findOne({ where: { instanceId: processInstanceId } });
    }


    public async getProcessStatus(bedId: string, userId): Promise<ProcessInstanceStatusReturnedParams> {
        let processStatusData: ProcessInstanceStatusReturnedParams = new ProcessInstanceStatusReturnedParams();
        const processInstance = await this.getProcessInstanceOfBed(bedId);
        processInstance.sectorInstances = this.orderSectors(processInstance.sectorInstances, processInstance.sectorsOrder);

        processStatusData.processInstanceId = processInstance.instanceId;
        processStatusData.name = processInstance.name;
        processStatusData.description = processInstance.description;
        processStatusData.creator = processInstance.creator.fullname;
        processStatusData.department = await this.departmentService.getDepartmentByID(processInstance.departmentId);
        processStatusData.room = await this.roomsService.getRoomByID(processInstance.roomId);
        processStatusData.processStatus = processInstance.status;
        processStatusData.processType = processInstance.processType.name;
        processStatusData.sectorInstances = processInstance.sectorInstances;
        processStatusData.currentSectorInstance = await this.getCurrentSectorOfProcessInstanceOfUser(processInstance, userId);
        return processStatusData;
    }

    public async updateProcessStatus(bedId: string, data: UpdateSectorStatusParams): Promise<ProcessInstance> {
        const processInstance: ProcessInstance = await this.getProcessInstance(data.processInstanceId);

        if (processInstance.bed.id != bedId) {
            //ToDo: throw exception
            log("process instance not match to bed error")
            return;
        }
        let currentSectorInstance = this.getCurrentSectorOfProcessInstace(processInstance);

        log("current sector instance")

        log(currentSectorInstance.name)
        // change it if there`s a feature of parallel sectors in process
        if (currentSectorInstance.instanceId != data.sectorInstanceId) {
            //ToDo: throw exception
            log("sector instance not match error")
            return;
        }

        if (currentSectorInstance.commitingWorker.id != data.userId && data.userId != currentSectorInstance.responsiblePerson.id) {
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
        return await this.processInstanceRepo.findOne({
            relations: { bed: true, sectorInstances: true, processType: true, creator: true },
            where: {
                bed: { id: bedId },
            },
        })

    }

    private updateSectorInstanceStatus(sectorInstance: SectorInstance, status: Status): void {
        log(typeof (sectorInstance.status))
        log(typeof (status))
        if (sectorInstance.status > status) {
            //ToDo: throw exception
            log("status error")
            return
        }

        if (sectorInstance.status == status) {
            log("status equal error")
            return;
        }

        sectorInstance.status = status;
        log()
        if (status == Status.Done) {
            sectorInstance.endedAt = new Date()
        }
    }

    private getCurrentSectorOfProcessInstace(processInstance: ProcessInstance): SectorInstance {
        let currentSectorInstance: SectorInstance = null;
        for (let instance of processInstance.sectorInstances) {
            if (instance.status != Status.Done) {
                currentSectorInstance = instance;
                break;
            }
        }
        return currentSectorInstance;
    }

    private async getCurrentSectorOfProcessInstanceOfUser(processInstance: ProcessInstance, userId: number): Promise<SectorInstance> {
        let currentSectorInstance: SectorInstance = null;
        let user: User = await this.usersService.getUserById(userId);
        let isUserAManager: boolean = user.role.name == 'Admin';
        for (let instance of processInstance.sectorInstances) {
            if (instance.status != Status.Done && (isUserAManager || instance.commitingWorker.id == userId || instance.responsiblePerson.id == userId || processInstance.creator.id == userId)) {
                currentSectorInstance = instance;
                break;
            }
        }
        return currentSectorInstance;
    }

    private validateProcessStatus(processInstance: ProcessInstance): boolean {

        let isDone: boolean = processInstance.sectorInstances.every(instance => instance.status == Status.Done)
        if (isDone) {
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
        const commitingWorker: User = await this.usersService.getUserById(data.workerId);
        const responsiblePerson: User = await this.usersService.getUserById(data.responsibleUserId);
        const sector: Sector = await this.sectorsService.getSector(data.id);

        let newSectorInstance: SectorInstance = await this.sectorInstanceRepo.create();
        newSectorInstance.instanceId = randomUUID();
        newSectorInstance.sectorId = data.id;
        newSectorInstance.status = Status[Status.Waiting];
        newSectorInstance.responsiblePerson = responsiblePerson;
        newSectorInstance.commitingWorker = commitingWorker;
        newSectorInstance.bed = bed;
        newSectorInstance.name = sector.name;

        return newSectorInstance;
    }

    private orderSectors(sectors: SectorInstance[], order: string[]) {
        if (sectors.length != order.length) {
            // throw err
        }
        let instancesOrder: string[] = sectors.map(instance => instance.instanceId);
        if (JSON.stringify(instancesOrder) === JSON.stringify(order)) {
            return sectors;
        }
        let orderedArray: SectorInstance[] = [];
        order.forEach(instanceId => {
            const sector: SectorInstance = sectors.find(sec => sec.instanceId == instanceId)
            if (sector) { orderedArray.push(sector) }
            else {
                // think aboud the exception. maybe internal server error?
            }
        })
        return orderedArray;
    }
}
