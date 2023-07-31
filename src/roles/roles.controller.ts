import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.entities';
import { CreateRoleParams } from '@checkout/types';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('roles')
@ApiNotFoundResponse({description: 'Role not found'})
@ApiForbiddenResponse({description: 'Forbidden.'})
export class RolesController {
    constructor(private rolesService: RolesService){}

    @Get()
    public async getRoles(): Promise<Role[]>{
        return await this.rolesService.getRoles();
    }

    @Get(':roleId')
    @ApiParam({name: 'roleId', description: 'The id of the role'})

    public async getRoleById(@Param() params): Promise<Role>{
        return await this.rolesService.getRoleById(params.roleId);
    }

    @Post()
    @ApiOkResponse({description: 'Room edited'})
    public async createRole(@Body() data: CreateRoleParams): Promise<Role>{
        return await this.rolesService.createRole(data);
    }
}
