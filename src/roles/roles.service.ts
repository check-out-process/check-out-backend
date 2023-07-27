import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './roles.entities';
import { CreateRoleParams } from '@checkout/types';
import { createOrUpdateObjectFromParams } from '../common/utils';
import { randomUUID } from 'crypto';

@Injectable()
export class RolesService {
    constructor(
        @Inject('ROLE_REPOSITORY')
        private rolesRepository: Repository<Role>
    ){}

    public async createRole(data: CreateRoleParams): Promise<Role>{
        let role: Role = this.rolesRepository.create();
        role = createOrUpdateObjectFromParams(role, data);
        role.id = randomUUID();
        return await this.rolesRepository.save(role);
    }

    public async getRoles(): Promise<Role[]>{
        return await this.rolesRepository.find();
    }

    public async getRoleById(roleId: string): Promise<Role>{
        return await this.rolesRepository.findOne({where:{id: roleId}})
    }
}
