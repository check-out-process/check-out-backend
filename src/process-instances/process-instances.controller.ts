import { CreateProcessInstanceFromDataParams, GetProcessInstanceStatusParams, ProcessInstanceStatusReturnedParams, UpdateSectorInstanceParams, UpdateSectorStatusParams } from '@checkout/types';
import { Body, Controller, Headers, Get, Param, Patch, Post } from '@nestjs/common';
import { ProcessInstance } from './process-instances.entities';
import { ProcessInstancesService } from './process-instances.service';
import { verify } from 'jsonwebtoken';

@Controller('process-instances')
export class ProcessInstancesController {
    constructor(private processInstancesService: ProcessInstancesService){}

    @Get()
    public async getAllProcessInstances(): Promise<ProcessInstance[]> {
        return await this.processInstancesService.getAllProcessInstances();
    }

    @Get(':processId')
    public async getProcessInstance(@Param() params): Promise<ProcessInstance> {
        return await this.processInstancesService.getProcessInstance(params.processId);
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
    public async getProcessStatus(@Param() params, @Headers() headers): Promise<ProcessInstanceStatusReturnedParams>{
        const decoded = verify(headers["x-access-token"], process.env.ACCESS_TOKEN_SECRET);
        return await this.processInstancesService.getProcessStatus(params.bedId, decoded.id);
    }

    @Patch(':bedId/update-status')
    public async updateProcessStatus(@Param() params, @Body() data: UpdateSectorStatusParams): Promise<void> {
        await this.processInstancesService.updateProcessStatus(params.bedId, data);
    }
}
