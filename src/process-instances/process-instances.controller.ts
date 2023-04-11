import { createProcessInstanceFromDataParams } from '@checkout/types';
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
    public async createProcessInstance(@Body() data: createProcessInstanceFromDataParams): Promise<ProcessInstance> {
        return await this.processInstancesService.createProcessInstanceFromData(data);
    }
}
