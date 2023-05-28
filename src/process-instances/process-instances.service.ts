import { CreateProcessInstanceFromDataParams, NewSectorInstanceData, ProcessInstanceStatusReturnedParams, Status, UpdateSectorInstanceParams, UpdateSectorStatusParams } from '@checkout/types';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Bed } from 'src/beds/beds.entities';
import { ProcessType } from 'src/process-templates/process-templates.entities';
import { Sector } from 'src/sectors/sectors.entities';
import { User } from 'src/users/users.entities';
import { Not, Repository } from 'typeorm';
import { ProcessInstance } from './process-instances.entities';
import { SectorInstance } from './sector-instance.entities';
import { log } from 'console';
import { DepartmentService } from 'src/department/department.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { BedsService } from 'src/beds/beds.service';
import { UsersService } from 'src/users/users.service';
import { SectorsService } from 'src/sectors/sectors.service';
import { ProcessTemplatesService } from 'src/process-templates/process-templates.service';
import * as _ from 'lodash';
import { Department } from 'src/department/department.entities';
import { Room } from 'src/rooms/rooms.entities';
import { Role } from '@checkout/types';
import { SmsService } from 'src/sms/sms.service';
import { SectorsController } from 'src/sectors/sectors.controller';


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
        private processTemplatesService: ProcessTemplatesService,
        private smsService: SmsService
    ) { }

    public async getUserProcessInstances(userId: number): Promise<ProcessInstance[]> {
        const instances = await this.processInstanceRepo
            .createQueryBuilder('processInstance')
            .leftJoinAndSelect("processInstance.bed", "bed")
            .leftJoinAndSelect("processInstance.department", "department")
            .leftJoinAndSelect("processInstance.room", "room")
            .leftJoinAndSelect("processInstance.sectorInstances", "sectorInstance")
            .leftJoinAndSelect("sectorInstance.commitingWorker", "commitingWorker")
            .leftJoinAndSelect("sectorInstance.responsiblePerson", "responsiblePerson")
            .leftJoinAndSelect("processInstance.processType", "processType")
            .leftJoinAndSelect("processInstance.creator", "creator")
            .where("creator.id = :userId", { userId })
            .orWhere("commitingWorker.id = :userId", { userId })
            .orWhere("responsiblePerson.id = :userId", { userId })
            .getMany();

        instances.forEach(instance => {
            delete instance.sectorInstances;
            delete instance.sectorsOrder;
        });

        return instances;
    }

    public async getAllSectorInstances(): Promise<SectorInstance[]> {
        return await this.sectorInstanceRepo.find();
    }

    public async getUserProcessInstance(processId: string, userId: number): Promise<ProcessInstance> {
        let instance = await this.processInstanceRepo.findOne({ where: { instanceId: processId } });
        let userSectorsInstance;

        if (instance.creator.id === userId) {
            userSectorsInstance = instance.sectorInstances;
        } else {
            userSectorsInstance = await this.getUserSectorsInstance(instance.sectorInstances, userId);
        }

        instance.sectorInstances = this.orderSectors(userSectorsInstance, instance.sectorsOrder);

        return instance;
    }

    private async getProcessInstance(id: string): Promise<ProcessInstance> {
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
        const processInstanceOfBed: ProcessInstance = await this.getProcessInstanceOfBedInProcess(data.bedId)

        if (!_.isEmpty(processInstanceOfBed)) {
            throw new HttpException("there is already active process instance of bed", HttpStatus.CONFLICT);
        }

        let processInstance: ProcessInstance = this.processInstanceRepo.create();
        let sectorInstances: SectorInstance[] = [];
        let orderedSectorInstances: string[] = [];
        const bed: Bed = await this.bedsService.getBedByID(data.bedId);
        const department: Department = await this.departmentService.getDepartmentByID(data.departmentId);
        const room: Room = await this.roomsService.getRoomByID(data.roomId);

        for (let i = 0; i < data.orderedSectors.length; i++) {
            const sectorInstanceData: NewSectorInstanceData = data.orderedSectors[i];
            const newSectorInstance = await this.createSectorInstance(sectorInstanceData, bed);
            sectorInstances.push(newSectorInstance);
            orderedSectorInstances.push(newSectorInstance.instanceId);
        }

        const processType: ProcessType = await this.processTemplatesService.getProcessTypeByUUID(data.processTypeId)
        const creator: User = await this.usersService.getUserById(data.creatorId);
        processInstance.bed = bed;
        processInstance.instanceId = randomUUID();
        processInstance.sectorsOrder = orderedSectorInstances;
        processInstance.sectorInstances = sectorInstances;
        processInstance.creator = creator;
        processInstance.name = data.name;
        processInstance.description = data.description;
        processInstance.processType = processType;
        processInstance.department = department;
        processInstance.room = room;
        processInstance.isIsolation = data.isIsolation;
        processInstance.status = Status.In_Progress;

        return await this.processInstanceRepo.save(processInstance);

    }

    public async updateSectorInstance(data: UpdateSectorInstanceParams, processInstanceId: string, sectorInstanceId: string): Promise<ProcessInstance> {
        let instance = await this.sectorInstanceRepo.findOne({ where: { instanceId: sectorInstanceId } });
        if (data.status) {
            instance.status = data.status;
            if (data.status == Status.Done) {
                instance.endedAt = new Date();
            }
        }
        if (data.commitingWorkerId) {
            const worker = await this.usersService.getUserById(data.commitingWorkerId);
            instance.commitingWorker = worker;
        }
        if (data.responsiblePersonId) {
            const responsible = await this.usersService.getUserById(data.responsiblePersonId);
            instance.responsiblePerson = responsible;
        }
        await this.sectorInstanceRepo.save(instance);

        const processInstance: ProcessInstance = await this.getProcessInstance(processInstanceId);
        this.validateProcessStatus(processInstance);
        const process: ProcessInstance = await this.processInstanceRepo.save(processInstance);

        // i put this if here , because we want to to send sms to next secotor after the sector will save in DB. 
        if (data.status && data.status == Status.Done) {
            this.notifyNextCommitingSectorProcess(process);
        }
        return process;
    }


    public async getProcessStatus(bedId: string, userId): Promise<ProcessInstanceStatusReturnedParams> {
        let processStatusData: ProcessInstanceStatusReturnedParams = new ProcessInstanceStatusReturnedParams();
        const processInstance = await this.getProcessInstanceOfBedInProcess(bedId);
        if (_.isEmpty(processInstance)) {
            throw new HttpException(`there is no processInstance of bedId ${bedId}`, HttpStatus.NOT_FOUND);
        } else {
            processInstance.sectorInstances = this.orderSectors(processInstance.sectorInstances, processInstance.sectorsOrder);

            processStatusData.processInstanceId = processInstance.instanceId;
            processStatusData.name = processInstance.name;
            processStatusData.description = processInstance.description;
            processStatusData.creator = processInstance.creator.fullname;
            processStatusData.department = processInstance.department;
            processStatusData.room = processInstance.room;
            processStatusData.processStatus = processInstance.status;
            processStatusData.processType = processInstance.processType.name;
            processStatusData.sectorInstances = processInstance.sectorInstances;
            const { currentSectorInstance, userSectorInstances } = await this.getSectorsOfProcessInstanceOfUser(processInstance, userId);
            processStatusData.currentSectorInstance = currentSectorInstance;
            processStatusData.sectorInstances = userSectorInstances;

            return processStatusData;
        }

    }

    public async updateProcessStatus(bedId: string, data: UpdateSectorStatusParams, userId: number): Promise<ProcessInstance> {
        const processInstance: ProcessInstance = await this.getProcessInstance(data.processInstanceId);

        if (processInstance.bed.id != bedId) {
            throw new HttpException("process instance not match to bed", HttpStatus.NOT_FOUND);
        }

        let currentUserSectorInstance = this.getSectorBysectorInstanceId(processInstance, data.sectorInstanceId);

        if (!currentUserSectorInstance || currentUserSectorInstance.instanceId != data.sectorInstanceId) {
            throw new HttpException("sector instance not match processInstance", HttpStatus.NOT_FOUND);
        }

        if (currentUserSectorInstance.commitingWorker.id != userId && userId != currentUserSectorInstance.responsiblePerson?.id && userId != processInstance.creator.id) {
            throw new HttpException("user not have permmision to edit sector", HttpStatus.FORBIDDEN);
        }

        this.updateSectorInstanceStatus(currentUserSectorInstance, data.status);
        this.validateProcessStatus(processInstance);
        return await this.processInstanceRepo.save(processInstance)
    }

    public async notifyNextCommitingSectorProcess(process: ProcessInstance) {
        if (process.status === Status.Done) {
            const message = `התהליך הסתיים בהצלחה עבור מחלקה ${process.department.name} , חדר ${process.room.name}, מיטה ${process.bed.name}`;
            await this.smsService.sendSms(process.creator.phoneNumber, message);
        } else {
            const sectorInstance: SectorInstance = process.sectorInstances.find((sectorInstance: SectorInstance) => sectorInstance.status !== Status.Done);
            const message = `התהליך במחלקה ${process.department.name} , חדר ${process.room.name}, מיטה ${process.bed.name} מחכה לטיפולך בסקטור ${sectorInstance.name} , בהצלחה`;
            await this.smsService.sendSms(sectorInstance.commitingWorker.phoneNumber, message);
        }
    }

    private async getProcessInstanceOfBed(bedId: string): Promise<ProcessInstance> {
        return await this.processInstanceRepo.findOne({
            where: {
                bed: { id: bedId },
            },
        })

    }

    private async getProcessInstanceOfBedInProcess(bedId: string): Promise<ProcessInstance> {
        return await this.processInstanceRepo.findOne({
            where: {
                bed: { id: bedId },
                status: Not(Status.Done)
            },
        })
    }

    private updateSectorInstanceStatus(sectorInstance: SectorInstance, status: Status): void {
        if (sectorInstance.status > status) {
            //ToDo: change because its enum string
        }

        if (sectorInstance.status == status) {
            throw new HttpException("status  already equals", HttpStatus.CONFLICT);
        }

        sectorInstance.status = status;
        if (status == Status.Done) {
            sectorInstance.endedAt = new Date()
        }
    }

    private getSectorBysectorInstanceId(processInstance: ProcessInstance, sectorInstanceId: string): SectorInstance {
        return processInstance.sectorInstances.find(sectorInstance => sectorInstance.instanceId === sectorInstanceId);
    }

    private async getSectorsOfProcessInstanceOfUser(processInstance: ProcessInstance, userId: number) {
        let currentSectorInstance: SectorInstance = null;
        let userSectorInstances: SectorInstance[] = [];

        let user: User = await this.usersService.getUserById(userId);
        let isUserAManager: boolean = user.role.name == Role.Admin;
        for (let instance of processInstance.sectorInstances) {
            if (instance.status != Status.Done && (isUserAManager || instance.commitingWorker.id == userId || instance.responsiblePerson?.id == userId || processInstance.creator.id == userId)) {
                if (_.isEmpty(currentSectorInstance)) {
                    currentSectorInstance = instance;
                } else {
                    userSectorInstances.push(instance);
                }
            }
        }
        return { currentSectorInstance, userSectorInstances }
    }

    private async getUserSectorsInstance(sectorInstances: SectorInstance[], userId: number) {
        let userSectorInstances: SectorInstance[] = [];
        let user: User = await this.usersService.getUserById(userId);
        let isUserAManager: boolean = user.role.name == Role.Admin;

        if (isUserAManager) {
            return sectorInstances;
        } else {
            sectorInstances.forEach(sectorInstance => {
                if (sectorInstance.commitingWorker.id == userId || sectorInstance.responsiblePerson?.id == userId) {
                    userSectorInstances.push(sectorInstance)
                }
            });

            return userSectorInstances;
        }
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

    private async createSectorInstance(data: NewSectorInstanceData, bed: Bed): Promise<SectorInstance> {
        const commitingWorker: User = await this.usersService.getUserById(data.workerId);
        const responsiblePerson: User = await this.usersService.getUserById(data.responsibleUserId);
        const sector: Sector = await this.sectorsService.getSector(data.id);

        let newSectorInstance: SectorInstance = await this.sectorInstanceRepo.create();
        newSectorInstance.instanceId = randomUUID();
        newSectorInstance.sectorId = data.id;
        newSectorInstance.status = commitingWorker ? Status.In_Progress : Status.Waiting;
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
