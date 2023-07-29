import { NotFoundError } from "../common/exceptions";
import { ProcessTemplate, ProcessType } from "./process-templates.entities";
import fetch from 'node-fetch';

export class ProcessTemplatesHelper{
    public static async getProcessTypeById(typeId: number): Promise<ProcessType>{
        const url = `http://localhost:8080/process-templates/types/${typeId}`;
        const res = await fetch(url);
        if (res.ok){
            const processType : ProcessType = await res.json();
            return processType;
        }
        if (res.status == 404){
            throw new NotFoundError(`ProcessType with id ${typeId} not found.`);
        }
        throw new Error("Something went wrong");
    }

    public static async getProcessTemplateById(templateId: string): Promise<ProcessTemplate>{
        const url = `http://localhost:8080/process-templates/${templateId}`;
        const res = await fetch(url);
        if (res.ok){
            const processTemplate : ProcessTemplate = await res.json();
            return processTemplate;
        }
        if (res.status == 404){
            throw new NotFoundError(`Process Template with id ${templateId} not found.`);
        }
        throw new Error("Something went wrong");
    }
}