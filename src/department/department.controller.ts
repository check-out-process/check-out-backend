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
    async getAllDepartments(){
        return await this.departmentService.getAllDepartments();
    }

    @Get(':departmentUUID')
    async getDepartment(@Param() params) : Promise<Department>{
        return await this.departmentService.getDepartmentByUUID(params.departmentUUID);
    }

    @Post()
    async addDepartment(@Body() data: DepartmentCreationParams){
        return await this.departmentService.addDepartment(data)
    }

    @Patch(':departmentUUID')
    async editDepartment(@Param() params, @Body() data : DepartmentPatchParams){
        return await this.departmentService.updateDepartment(params.departmentUUID, data);
    }

    @Delete(':departmentUUID')
    async deleteDepartment(@Param() params) : Promise<void>{
        await await this.departmentService.deleteDepartment(params.departmentUUID);
    }
}
