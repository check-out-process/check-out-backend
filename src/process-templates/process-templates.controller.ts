import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AddProcessTemplateParams, AddProcessTypeParams, PatchProcessTemplateParams } from '@checkout/types';
import { ProcessTemplate, ProcessType } from './process-templates.entities';
import { ProcessTemplatesService } from './process-templates.service';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiNotFoundResponse({description: 'Process Template not found'})
@ApiForbiddenResponse({description: 'Forbidden.'})
@ApiTags('process-templates')
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
    @ApiParam({name: 'processId', description: 'Id of process template'})
    public async getProcess(@Param() params): Promise<ProcessTemplate> {
        return await this.processService.getProcessTemplateById(params.processId);
    }

    @Get('types/:typeId')
    @ApiParam({name: 'typeId', description: 'Id of process type'})
    public async getProcessType(@Param() params): Promise<ProcessType>{
        return await this.processService.getProcessTypeByID(params.typeId);
    }

    @Post()
    @ApiOkResponse({description: 'Process Template created'})
    public async createProcess(@Body() data: AddProcessTemplateParams): Promise<ProcessTemplate>{
        return await this.processService.addProcessTemplate(data);
    }

    @Post('types')
    @ApiOkResponse({description: 'Process Type created'})
    public async createProcessType(@Body() data: AddProcessTypeParams): Promise<ProcessType>{
        return await this.processService.addProcessType(data);
    }

    @Patch(':processId')
    @ApiParam({name: 'processId', description: 'Id of process template'})
    @ApiOkResponse({description: 'Process Template edited'})
    public async updateProcess(
        @Param() params,
        @Body() data: PatchProcessTemplateParams): Promise<ProcessTemplate>{
            return await this.processService.updateProcessTemplate(params.processId, data);
        }
    
    @Delete(':processId')
    @ApiParam({name: 'processId', description: 'Id of process template'})
    @ApiOkResponse({description: 'Process Template deleted'})
    public async deleteProcess(@Param() params): Promise<ProcessTemplate>{
        return await this.processService.deleteProcessTemplate(params.processId);
    }
}
