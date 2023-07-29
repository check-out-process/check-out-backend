import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { DepartmentCreationParams, DepartmentPatchParams } from '@checkout/types';
import { randomUUID } from 'crypto';
import { Department } from './department.entities';
import { Repository } from 'typeorm';
import { createOrUpdateObjectFromParams } from '../common/utils';

@Injectable()
export class DepartmentService {
    constructor(
        @Inject('DEPARTMENT_REPOSITORY')
        private departmentRepo: Repository<Department> 
    ) {}
    
    public async getAllDepartments() : Promise<Department[]>{
        return this.departmentRepo.find();
    }

    public async getDepartmentByID(id: string) : Promise<Department>{
        const department = this.departmentRepo.findOne({
            where: {
                id: id
            }
        })
        if (!department){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return department;
    }

    public async addDepartment(data : DepartmentCreationParams) : Promise<Department>{
        let newDepartment : Department = this.departmentRepo.create();
        newDepartment = createOrUpdateObjectFromParams(newDepartment, data);
        newDepartment.id = randomUUID();
        this.departmentRepo.save(newDepartment);
        return newDepartment;
    }

    public async deleteDepartment(id: string) : Promise<Department> {
        let departmentToDelete : Department = await this.getDepartmentByID(id);
        this.departmentRepo.delete(departmentToDelete);
        return departmentToDelete;
    }

    public async updateDepartment(id : string, data : DepartmentPatchParams) : Promise<Department> {
        let department : Department = await this.getDepartmentByID(id);
        department = createOrUpdateObjectFromParams(department, data);
        this.departmentRepo.save(department);
        return department;
    }


}
