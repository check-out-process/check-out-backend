import { CreateProcessInstanceFromDataParams, GetProcessInstanceStatusParams, ProcessInstanceStatusReturnedParams, Status, UpdateSectorInstanceParams, UpdateSectorStatusParams } from '@checkout/types';
import { Body, Controller, Headers, Get, Param, Patch, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ProcessInstance } from './process-instances.entities';
import { ProcessInstancesService } from './process-instances.service';
import { getUserDecoded } from '../auth/auth.helper';
import { SmsService } from '../sms/sms.service';
import { SectorInstance } from './sector-instance.entities';


@Controller('process-instances')
export class ProcessInstancesController {
    constructor(private processInstancesService: ProcessInstancesService, private smsService: SmsService) { }

    @Get()
    public async getUserProcessInstances(@Headers() headers): Promise<ProcessInstance[]> {
        const userDecoded = getUserDecoded(headers["x-access-token"]);
        return await this.processInstancesService.getUserProcessInstances(userDecoded.id);
    }

    @Get(':processId')
    public async getUserProcessInstance(@Param() params, @Headers() headers): Promise<ProcessInstance> {
        const userDecoded = getUserDecoded(headers["x-access-token"]);
        return await this.processInstancesService.getUserProcessInstance(params.processId, userDecoded.id);
    }

    @Post()
    public async createProcessInstance(@Body() data: CreateProcessInstanceFromDataParams): Promise<ProcessInstance> {
        const process: ProcessInstance = await this.processInstancesService.createProcessInstanceFromData(data);
        await this.processInstancesService.notifyNextCommitingSectorProcess(process)
        return process;
    }

    @Patch(':processId/sector-instances/:sectorId')
    public async updateSectorInstance(@Param() params, @Body() data: UpdateSectorInstanceParams): Promise<ProcessInstance> {
        return await this.processInstancesService.updateSectorInstance(data, params.processId, params.sectorId);
    }

    @Get(':bedId/update-status')
    public async getProcessStatus(@Param() params, @Headers() headers): Promise<ProcessInstanceStatusReturnedParams> {
        const userDecoded = getUserDecoded(headers["x-access-token"]);
        return await this.processInstancesService.getProcessStatus(params.bedId, userDecoded.id);
    }

    @Patch(':bedId/update-status')
    public async updateProcessStatus(@Param() params, @Headers() headers, @Body() data: UpdateSectorStatusParams): Promise<void> {
        const userDecoded = getUserDecoded(headers["x-access-token"]);
        const process: ProcessInstance = await this.processInstancesService.updateProcessStatus(params.bedId, data, userDecoded.id);
        await this.processInstancesService.notifyNextCommitingSectorProcess(process)  
    }

    @Patch(':processInstanceId/sectorInstance/:sectorInstanceId/recive')
    public async updateSectorStartWork(@Param() params, @Headers() headers): Promise<void> {
        const sector: SectorInstance = await this.processInstancesService.getSectorInstance(params.sectorInstanceId);
        if (sector.status === Status.Done){
            throw new HttpException(`Sector status already Done , cannot update it`, HttpStatus.CONFLICT)
        }
        await this.processInstancesService.updateSectorInstanceStatus(sector, Status.In_Progress);
        await this.processInstancesService.sendFinsihMessageToSector(sector,params.processInstanceId)  
    }
}
