import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './roles.entities';

@Injectable()
export class RolesService {
    constructor(
        @Inject('ROLE_REPOSITORY')
        private rolesRepository: Repository<Role>
    ){}

    public async getRoles(): Promise<Role[]>{
        return await this.rolesRepository.find();
    }

    public async getRoleById(roleId: number): Promise<Role>{
        return await this.rolesRepository.findOne({where:{id: roleId}})
    }
}
