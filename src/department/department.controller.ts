import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { DepartmentService } from './department.service';
import { DepartmentCreationParams, DepartmentPatchParams } from '@checkout/types';
import { Department } from './department.entities';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('departments')
@ApiTags('departments')
@ApiNotFoundResponse({description: 'Department not found'})
@ApiForbiddenResponse({description: 'Forbidden.'})
export class DepartmentController {
    constructor(private departmentService: DepartmentService){}

    @Get()
    async getAllDepartments() : Promise<Department[]> {
        return await this.departmentService.getAllDepartments();
    }

    @Get(':departmentID')
    @ApiParam({name: 'departmentID', description: 'Id of department'})
    async getDepartment(@Param() params) : Promise<Department>{
        return await this.departmentService.getDepartmentByID(params.departmentID);
    }

    @Post()
    @ApiOkResponse({description: 'Created edited'})
    async addDepartment(@Body() data: DepartmentCreationParams) : Promise<Department>{
        return await this.departmentService.addDepartment(data)
    }

    @Patch(':departmentID')
    @ApiParam({name: 'departmentID', description: 'Id of department'})
    @ApiOkResponse({description: 'Department edited'})
    async editDepartment(@Param() params, @Body() data : DepartmentPatchParams) : Promise<Department>{
        return await this.departmentService.updateDepartment(params.departmentID, data);
    }

    @Delete(':departmentID')
    @ApiParam({name: 'departmentID', description: 'Id of department'})
    @ApiOkResponse({description: 'Department deleted'})
    async deleteDepartment(@Param() params) : Promise<Department>{
        return await this.departmentService.deleteDepartment(params.departmentID);
    }
}
