import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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
        @Body() data: any): Promise<User>{
            return await this.usersService.updateUser(params.userID, data as any);
    }

    @Delete(':userID')
    public async deleteUser(@Param() params): Promise<User>{
        return await this.usersService.deleteUser(params.userID);
    }
}
