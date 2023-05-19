import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserPatchAddSectorParams, UserPatchParams } from '@checkout/types';
import { User } from './users.entities';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get()
    public async getAllUsers() : Promise<User[]> {
        return await this.usersService.getAllUsers();
    }

    @Get(':userID')
    public async getUserById(@Param() params): Promise<User>{
        const user : User = await this.usersService.getUserById(params.userID);
        await user.sectors;
        return user;
    }
    @Patch(':userID')
    public async updateUser(
        @Param() params,
        @Body() data: UserPatchParams | UserPatchAddSectorParams): Promise<User>{
            if (data instanceof UserPatchParams){
                return await this.usersService.updateUser(params.userID, data);
            }
            else if (data instanceof UserPatchAddSectorParams){
                return await this.usersService.addSectorToUser(params.userID, data);
            }
            else{
                console.log("error");
            }
    }

    @Delete(':userID')
    public async deleteUser(@Param() params): Promise<User>{
        return await this.usersService.deleteUser(params.userID);
    }
}
