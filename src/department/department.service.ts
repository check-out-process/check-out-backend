import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DepartmentCreationParams, DepartmentPatchParams } from './department.dto';
import { DEPARTMENTS } from './departments.mock';
import { randomUUID } from 'crypto';
import { Department } from './department.entitites';

@Injectable()
export class DepartmentService {
    private departments : Department[] = DEPARTMENTS;
    
    public async getAllDepartments() : Promise<Department[]>{
        return this.departments;
    }

    public async getDepartmentByUUID(uuid: string) : Promise<Department>{
        const department = this.departments.find((department) => 
            department.UUID === uuid);
        if (!department){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return department;
    }

    public async addDepartment(department : DepartmentCreationParams) : Promise<Department>{
        let newDepartment : Department = new Department();
        const parameters : string[] = Object.keys(department);
        parameters.forEach((parameter) => {
            newDepartment[parameter] = department[parameter];
        });
        newDepartment.UUID = randomUUID();
        this.departments.push(newDepartment);
        return newDepartment;
    }

    public async deleteDepartment(uuid: string) : Promise<void> {
        const departmentIndex = this.departments.findIndex((department) => 
            department.UUID === uuid);
        if (departmentIndex == -1){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        this.departments.splice(departmentIndex, 1);
        return;
    }

    public async updateDepartment(uuid : string, data : DepartmentPatchParams) : Promise<Department> {
        const departmentIndex : number = this.departments.findIndex((department) => 
            department.UUID === uuid);
        if (departmentIndex == -1){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        let department : Department = this.departments[departmentIndex]
        const parametersChanged : string[] = Object.keys(data);
        parametersChanged.forEach((parameter) => {
            department[parameter] = data[parameter];
        })
        this.departments[departmentIndex] = department;
        return department;
    }


}
