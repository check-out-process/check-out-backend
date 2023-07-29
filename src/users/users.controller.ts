import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserPatchAddSectorParams, UserPatchParams } from '@checkout/types';
import { User } from './users.entities';
import { UsersService } from './users.service';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@ApiNotFoundResponse({description: 'User not found'})
@ApiForbiddenResponse({description: 'Forbidden.'})
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get()
    public async getAllUsers() : Promise<User[]> {
        return await this.usersService.getAllUsers();
    }

    @Get(':userID')
    @ApiParam({name: 'userID'})
    public async getUserById(@Param() params): Promise<User>{
        const user : User = await this.usersService.getUserById(params.userID);
        await user.sectors;
        return user;
    }

    @Patch(':userID')
    @ApiParam({name: 'userID'})
    @ApiOkResponse({description: 'User edited'})
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
    @ApiOkResponse({description: 'Deleted'})
    @ApiParam({name: 'userID'})
    public async deleteUser(@Param() params): Promise<User>{
        return await this.usersService.deleteUser(params.userID);
    }
}
