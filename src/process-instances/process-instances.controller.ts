import { CreateProcessInstanceFromDataParams, GetProcessInstanceStatusParams, ProcessInstanceStatusReturnedParams, Status, UpdateSectorInstanceParams, UpdateSectorStatusParams } from '@checkout/types';
import { Body, Controller, Headers, Get, Param, Patch, Post } from '@nestjs/common';
import { ProcessInstance } from './process-instances.entities';
import { ProcessInstancesService } from './process-instances.service';
import { getUserDecoded } from '../auth/auth.helper';
import { SmsService } from 'src/sms/sms.service';
import { SectorInstance } from './sector-instance.entities';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';


@Controller('process-instances')
@ApiTags('process-instances')
@ApiNotFoundResponse({description: 'Process Instance not found'})
@ApiForbiddenResponse({description: 'Forbidden.'})
export class ProcessInstancesController {
    constructor(private processInstancesService: ProcessInstancesService, private smsService: SmsService) { }

    @Get()
    public async getUserProcessInstances(@Headers() headers): Promise<ProcessInstance[]> {
        const userDecoded = getUserDecoded(headers["x-access-token"]);
        return await this.processInstancesService.getUserProcessInstances(userDecoded.id);
    }

    @Get(':processId')
    @ApiParam({name: 'processId', description: 'Id of process instance'})
    public async getUserProcessInstance(@Param() params, @Headers() headers): Promise<ProcessInstance> {
        const userDecoded = getUserDecoded(headers["x-access-token"]);
        return await this.processInstancesService.getUserProcessInstance(params.processId, userDecoded.id);
    }

    @Post()
    @ApiOkResponse({description: 'Process Instance created'})
    public async createProcessInstance(@Body() data: CreateProcessInstanceFromDataParams): Promise<ProcessInstance> {
        const process: ProcessInstance = await this.processInstancesService.createProcessInstanceFromData(data);
        await this.processInstancesService.notifyNextCommitingSectorProcess(process)
        return process;
    }

    @Patch(':processId/sector-instances/:sectorId')
    @ApiOkResponse({description: 'Sector instance edited'})
    @ApiParam({name: 'processId', description: 'Id of process template'})
    @ApiParam({name: 'sectorId', description: 'Id of sector template'})
    public async updateSectorInstance(@Param() params, @Body() data: UpdateSectorInstanceParams): Promise<ProcessInstance> {
        return await this.processInstancesService.updateSectorInstance(data, params.processId, params.sectorId);
    }

    @Get(':bedId/update-status')
    @ApiParam({name: 'bedId', description: 'Id of bed'})
    public async getProcessStatus(@Param() params, @Headers() headers): Promise<ProcessInstanceStatusReturnedParams> {
        const userDecoded = getUserDecoded(headers["x-access-token"]);
        return await this.processInstancesService.getProcessStatus(params.bedId, userDecoded.id);
    }

    @Patch(':bedId/update-status')
    @ApiParam({name: 'bedId', description: 'Id of bed'})
    @ApiOkResponse({description: 'Process Instance edited'})
    public async updateProcessStatus(@Param() params, @Headers() headers, @Body() data: UpdateSectorStatusParams): Promise<void> {
        const userDecoded = getUserDecoded(headers["x-access-token"]);
        const process: ProcessInstance = await this.processInstancesService.updateProcessStatus(params.bedId, data, userDecoded.id);
        await this.processInstancesService.notifyNextCommitingSectorProcess(process)  
    }
}
