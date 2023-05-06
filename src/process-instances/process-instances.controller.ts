import { CreateProcessInstanceFromDataParams, ProcessInstanceStatusReturnedParams, UpdateSectorStatusParams } from '@checkout/types';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProcessInstance } from './process-instances.entities';
import { ProcessInstancesService } from './process-instances.service';

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

    @Get(':bedId/update-status')
    public async getProcessStatus(@Param() params): Promise<ProcessInstanceStatusReturnedParams>{
        return await this.processInstancesService.getProcessStatus(params.bedId);
    }

    @Patch(':bedId/update-status')
    public async updateProcessStatus(@Param() params, @Body() data: UpdateSectorStatusParams): Promise<void> {
        await this.processInstancesService.updateProcessStatus(params.bedId, data);
    }
}
