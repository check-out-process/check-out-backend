import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { DepartmentCreationParams, DepartmentPatchParams } from './department.dto';
import { DEPARTMENTS } from './departments.mock';
import { randomUUID } from 'crypto';
import { Department } from './department.entities';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {
    constructor(
        @Inject('DEPARTMENT_REPOSITORY')
        private departmentRepo: Repository<Department> 
    ) {}
    
    public async getAllDepartments() : Promise<Department[]>{
        return this.departmentRepo.find();
    }

    public async getDepartmentByUUID(uuid: string) : Promise<Department>{
        const department = this.departmentRepo.findOne({
            where: {
                UUID: uuid
            }
        })
        if (!department){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return department;
    }

    public async addDepartment(department : DepartmentCreationParams) : Promise<Department>{
        let newDepartment : Department = this.departmentRepo.create();
        const parameters : string[] = Object.keys(department);
        parameters.forEach((parameter) => {
            newDepartment[parameter] = department[parameter];
        });
        newDepartment.UUID = randomUUID();
        this.departmentRepo.save(newDepartment);
        return newDepartment;
    }

    public async deleteDepartment(uuid: string) : Promise<Department> {
        let departmentToDelete : Department = await this.getDepartmentByUUID(uuid);
        this.departmentRepo.delete(departmentToDelete);
        return departmentToDelete;
    }

    public async updateDepartment(uuid : string, data : DepartmentPatchParams) : Promise<Department> {
        let department : Department = await this.getDepartmentByUUID(uuid);
        const parameters : string[] = Object.keys(data);
        parameters.forEach((parameter) => {
            department[parameter] = data[parameter];
        });
        this.departmentRepo.save(department);
        return department;
    }


}
