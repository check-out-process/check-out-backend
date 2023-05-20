import { CreateProcessInstanceFromDataParams, GetProcessInstanceStatusParams, ProcessInstanceStatusReturnedParams, UpdateSectorInstanceParams, UpdateSectorStatusParams } from '@checkout/types';
import { Body, Controller, Headers, Get, Param, Patch, Post } from '@nestjs/common';
import { ProcessInstance } from './process-instances.entities';
import { ProcessInstancesService } from './process-instances.service';
import { getUserDecoded } from '../auth/auth.helper';

@Controller('process-instances')
export class ProcessInstancesController {
    constructor(private processInstancesService: ProcessInstancesService) { }

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
        return await this.processInstancesService.createProcessInstanceFromData(data);
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
        await this.processInstancesService.updateProcessStatus(params.bedId, data, userDecoded.id);
    }
}
