import { Inject, Injectable } from '@nestjs/common';
import { Sector } from 'src/sectors/sectors.entities';
import { Repository } from 'typeorm';
import { UserCreationParams, UserPatchAddSectorParams, UserPatchParams } from '@checkout/types';
import { User } from './users.entities';
import { SectorsHelper } from 'src/sectors/sectors.helper';
import { createOrUpdateObjectFromParams } from 'src/common/utils';
import { JobsService } from 'src/jobs/jobs.service';
import { RolesService } from 'src/roles/roles.service';
import { Job } from 'src/jobs/jobs.entities';
import { Role } from 'src/roles/roles.entities';
import { JobsHelper } from 'src/jobs/jobs.helper';
import { RolesHelper } from 'src/roles/roles.helper';

@Injectable()
export class UsersService {
    
    constructor(
        @Inject('USER_REPOSITORY')
        private usersRepo: Repository<User>,

    ) {}

    public async getAllUsers() : Promise<User[]> {
        return await this.usersRepo.find();
    }

    public async getUserById(userId: number): Promise<User> {
        return await this.usersRepo.findOne({where : {id: userId}});
    }

    public async addUser(data: UserCreationParams): Promise<User> {
        let newUser : User = this.usersRepo.create();
        newUser = await this.createOrUpdateUserFromParams(newUser, data);
        this.usersRepo.save(newUser);
        return newUser;
    }

    public async updateUser(userId: number, data: UserPatchParams): Promise<User> {
        let userToUpdate : User = await this.getUserById(userId);
        userToUpdate = await this.createOrUpdateUserFromParams(userToUpdate, data);
        this.usersRepo.save(userToUpdate);
        return userToUpdate;
    }

    public async addSectorToUser(userId: number, data: UserPatchAddSectorParams): Promise<User> {
        const sector : Sector = await SectorsHelper.getSectorById(data.sectorId);
        let user : User = await this.getUserById(userId);
        (await user.sectors).push(sector);
        this.usersRepo.save(user);
        return user;
    }

    public async deleteUser(userId: number): Promise<User> {
        const user: User = await this.getUserById(userId);
        this.usersRepo.remove(user);
        return user;
    }

    private async createOrUpdateUserFromParams(user: User, data: UserCreationParams | UserPatchParams): Promise<User>{
        const parameters : string[] = Object.keys(data);
        const invalidKeys = ['jobId', 'roleId'];
        parameters.forEach((parameter) => {
            if(!(parameter in invalidKeys)){
                user[parameter] = data[parameter];
            }
        });
        if (data.jobId){
            //ToDo: try catch
            const job: Job = await JobsHelper.getJobById(data.jobId);
            user.job = job;
        }

        if (data.roleId){
            //ToDo: try catch
            const role: Role = await RolesHelper.getRoleById(data.roleId);
            user.role = role;
        }
        return user;
        
    }
}