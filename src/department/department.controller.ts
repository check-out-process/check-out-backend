import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { DepartmentService } from './department.service';
import { DepartmentCreationParams, DepartmentPatchParams } from './department.dto';
import { Department } from './department.entities';

@Controller('departments')
export class DepartmentController {
    constructor(private departmentService: DepartmentService){}

    @Get()
    async getAllDepartments() : Promise<Department[]> {
        return await this.departmentService.getAllDepartments();
    }

    @Get(':departmentID')
    async getDepartment(@Param() params) : Promise<Department>{
        return await this.departmentService.getDepartmentByID(params.departmentID);
    }

    @Post()
    async addDepartment(@Body() data: DepartmentCreationParams) : Promise<Department>{
        return await this.departmentService.addDepartment(data)
    }

    @Patch(':departmentID')
    async editDepartment(@Param() params, @Body() data : DepartmentPatchParams) : Promise<Department>{
        return await this.departmentService.updateDepartment(params.departmentID, data);
    }

    @Delete(':departmentID')
    async deleteDepartment(@Param() params) : Promise<Department>{
        return await this.departmentService.deleteDepartment(params.departmentID);
    }
}
