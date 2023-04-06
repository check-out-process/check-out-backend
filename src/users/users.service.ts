import { Inject, Injectable } from '@nestjs/common';
import { Sector } from 'src/sectors/sectors.entities';
import { SectorsService } from 'src/sectors/sectors.service';
import { DataSource, Repository } from 'typeorm';
import { UserCreationParams, UserPatchAddSectorParams, UserPatchParams } from './users.dto';
import { User } from './users.entities';
import { SectorsHelper } from 'src/sectors/sectors.helper';

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
        const parameters : string[] = Object.keys(data);
        parameters.forEach((parameter) => {
            newUser[parameter] = data[parameter];
        });
        this.usersRepo.save(newUser);
        return newUser;
    }

    public async updateUser(userId: number, data: UserPatchParams): Promise<User> {
        let userToUpdate : User = await this.getUserById(userId);
        const parameters : string[] = Object.keys(data);
        parameters.forEach((parameter) => {
            userToUpdate[parameter] = data[parameter];
        });
        this.usersRepo.save(userToUpdate);
        return userToUpdate;
    }

    public async addSectorToUser(userId: number, data: UserPatchAddSectorParams): Promise<User> {
        const sector : Sector = await SectorsHelper.getSectorById(data.sectorID);
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
}