import { Inject, Injectable } from '@nestjs/common';
import { Sector } from '../sectors/sectors.entities';
import { EntityPropertyNotFoundError, Repository } from 'typeorm';
import { UserCreationParams, UserPatchAddSectorParams, UserPatchParams } from '@checkout/types';
import { User } from './users.entities';
import { JobsService } from '../jobs/jobs.service';
import { RolesService } from '../roles/roles.service';
import { Job } from '../jobs/jobs.entities';
import { Role } from '../roles/roles.entities';
import { SectorsService } from '../sectors/sectors.service';
import * as _ from 'lodash';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class UsersService {

    constructor(
        @Inject('USER_REPOSITORY')
        private usersRepo: Repository<User>,
        private jobService: JobsService,
        private roleService: RolesService,
        private sectorService: SectorsService,
        private tokenService: TokensService
    ) { }

    public async getAllUsers(): Promise<User[]> {
        return await this.usersRepo.find();
    }

    public async getUserById(userId: number): Promise<User> {
        if (userId) {
            return await this.usersRepo.findOne({ where: { id: userId } });
        }
        return null;
    }

    public async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
        return await this.usersRepo.findOne({ where: { phoneNumber: phoneNumber } });
    }

    public async addUser(data: UserCreationParams): Promise<User> {
        let newUser: User = this.usersRepo.create();
        newUser = await this.createOrUpdateUserFromParams(newUser, data);
        await this.usersRepo.save(newUser);
        return newUser;
    }

    public async updateUser(userId: number, data: UserCreationParams): Promise<User> {
        let userToUpdate: User = await this.getUserById(userId);
        userToUpdate = await this.createOrUpdateUserFromParams(userToUpdate, data);
        await this.usersRepo.save(userToUpdate);
        return userToUpdate;
    }

    public async addSectorToUser(userId: number, data: UserPatchAddSectorParams): Promise<User> {
        const sector: Sector = await this.sectorService.getSector(data.sectorId);
        let user: User = await this.getUserById(userId);
        (await user.sectors).push(sector);
        this.usersRepo.save(user);
        return user;
    }

    public async deleteUser(userId: number): Promise<User> {
        const user: User = await this.getUserById(userId);
        try {
            await this.tokenService.removeAllTokenOfUserId(userId)
        }
        catch (error) {
            if (!(error instanceof EntityPropertyNotFoundError)) {
                throw error;
            }
        }
        await this.usersRepo.remove(user);
        return user;
    }

    private async createOrUpdateUserFromParams(user: User, data: UserCreationParams | UserPatchParams): Promise<User> {
        const parameters: string[] = Object.keys(data);
        const invalidKeys = ['jobId', 'roleId'];
        parameters.forEach((parameter) => {
            if (!(parameter in invalidKeys)) {
                user[parameter] = data[parameter];
            }
        });
        if (data.jobId) {
            //ToDo: try catch
            const job: Job = await this.jobService.getJob(data.jobId);
            user.job = job;
        }

        if (data.roleId) {
            //ToDo: try catch
            const role: Role = await this.roleService.getRoleById(data.roleId);
            user.role = role;
        }
        return user;

    }
}