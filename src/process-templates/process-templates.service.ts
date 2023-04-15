import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createOrUpdateObjectFromParams } from 'src/common/utils';
import { Sector } from 'src/sectors/sectors.entities';
import { SectorsHelper } from 'src/sectors/sectors.helper';
import { Repository } from 'typeorm';
import { AddProcessTemplateParams, AddProcessTypeParams, PatchProcessTemplateParams } from '@checkout/types';
import { ProcessTemplate, ProcessType } from './process-templates.entities';

@Injectable()
export class ProcessTemplatesService {
    constructor(
        @Inject('PROCESS_TEMPLATE_REPOSITORY')
        private processTemplatesRepo : Repository<ProcessTemplate>,

        @Inject('PROCESS_TYPE_REPOSITORY')
        private processTypesRepo : Repository<ProcessType>
    ) {}

    public async getAllProcessTemplates() : Promise<ProcessTemplate[]> {
        return await this.processTemplatesRepo.find();
    }

    public async getProcessTypes(): Promise<ProcessType[]> {
        return await this.processTypesRepo.find({});
    }

    public async getProcessTemplateById(processId: string) : Promise<ProcessTemplate> {
        return await this.processTemplatesRepo.findOne({where : {id: processId}});

    }

    public async getProcessTypeByID(typeId: number): Promise<ProcessType>{
        return await this.processTypesRepo.findOne({where: {id: typeId}})
    }

    public async addProcessTemplate(data: AddProcessTemplateParams) : Promise<ProcessTemplate> {
        let process: ProcessTemplate = this.processTemplatesRepo.create();
        process = await this.createOrUpdateProcessTemplateFromData(process, data);
        process.id = randomUUID();
        return await this.processTemplatesRepo.save(process);
    }

    public async addProcessType(data: AddProcessTypeParams): Promise<ProcessType>{
        let processType : ProcessType = this.processTypesRepo.create();
        processType = createOrUpdateObjectFromParams(processType, data);
        processType.uuid = randomUUID();
        return await this.processTypesRepo.save(processType);
    }

    public async updateProcessTemplate(processId: string, data: PatchProcessTemplateParams): Promise<ProcessTemplate>{
        let process: ProcessTemplate = await this.getProcessTemplateById(processId);
        process = await this.createOrUpdateProcessTemplateFromData(process, data);
        return await this.processTemplatesRepo.save(process);
    }

    public async deleteProcessTemplate(processId: string): Promise<ProcessTemplate> {
        const processToDelete : ProcessTemplate = await this.getProcessTemplateById(processId);
        return await this.processTemplatesRepo.remove(processToDelete);
    }


    private async createOrUpdateProcessTemplateFromData(proc: ProcessTemplate, data: AddProcessTemplateParams | PatchProcessTemplateParams): Promise<ProcessTemplate>{
        const parameters : string[] = Object.keys(data);
        parameters.forEach((parameter) => {
            if (parameter != "relatedSectors_ids" &&
            parameter != "processType"){
                proc[parameter] = data[parameter];
            }
        });
        if (data.relatedSectors_ids){
            const idArray: string[] = data.relatedSectors_ids;
            let newSectorArray: Sector[] = [];
            newSectorArray = await Promise.all(idArray.map(async (id: string) => {
                return await SectorsHelper.getSectorById(id);
            }))
            
            proc.relatedSectors = newSectorArray;
            proc.relatedSectorsOrder = idArray;
        }

        if (data.processType){
            proc.processType = await this.getProcessTypeByID(data.processType);
        }
        return proc;
    }


}
