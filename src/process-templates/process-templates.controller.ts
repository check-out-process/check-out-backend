import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AddProcessTemplateParams, AddProcessTypeParams, PatchProcessTemplateParams } from '@checkout/types';
import { ProcessTemplate, ProcessType } from './process-templates.entities';
import { ProcessTemplatesService } from './process-templates.service';

@Controller('process-templates')
export class ProcessTemplatesController {
    constructor(private processService: ProcessTemplatesService){}

    @Get()
    public async getAllProcesses(): Promise<ProcessTemplate[]>{
        return await this.processService.getAllProcessTemplates();
    }

    @Get('types')
    public async getAllProcessTypes(): Promise<ProcessType[]>{
        return await this.processService.getProcessTypes();
    }

    @Get(':processId')
    public async getProcess(@Param() params): Promise<ProcessTemplate> {
        return await this.processService.getProcessTemplateById(params.processId);
    }

    @Get('types/:typeId')
    public async getProcessType(@Param() params): Promise<ProcessType>{
        return await this.processService.getProcessTypeByID(params.typeId);
    }

    @Post()
    public async createProcess(@Body() data: AddProcessTemplateParams): Promise<ProcessTemplate>{
        return await this.processService.addProcessTemplate(data);
    }

    @Post('types')
    public async createProcessType(@Body() data: AddProcessTypeParams): Promise<ProcessType>{
        return await this.processService.addProcessType(data);
    }

    @Patch(':processId')
    public async updateProcess(
        @Param() params,
        @Body() data: PatchProcessTemplateParams): Promise<ProcessTemplate>{
            return await this.processService.updateProcessTemplate(params.processId, data);
        }
    
    @Delete(':processId')
    public async deleteProcess(@Param() params): Promise<ProcessTemplate>{
        return await this.processService.deleteProcessTemplate(params.processId);
    }
}
