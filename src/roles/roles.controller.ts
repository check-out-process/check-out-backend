import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './roles.entities';
import { CreateRoleParams } from '@checkout/types';

@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService){}

    @Get()
    public async getRoles(): Promise<Role[]>{
        return await this.rolesService.getRoles();
    }

    @Get(':roleId')
    public async getRoleById(@Param() params): Promise<Role>{
        return await this.rolesService.getRoleById(params.roleId);
    }

    @Post()
    public async createRole(@Body() data: CreateRoleParams): Promise<Role>{
        return await this.rolesService.createRole(data);
    }
}
