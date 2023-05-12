import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { User } from 'src/users/users.entities';
import { UsersService } from 'src/users/users.service';
import {genSalt, hash, compare} from 'bcrypt';
import { LogInParams, UserCreationParams } from '@checkout/types';
@Injectable()
export class AuthService {
    constructor(
        private userService : UsersService
    ){}

    public async login(logInParams: LogInParams): Promise<User> {
        if(logInParams.phoneNumber == null || logInParams.password == null){
            throw new HttpException("bad phoneNumber or password", HttpStatus.BAD_REQUEST);  
        }

        try {
            const user = await this.userService.getUserByPhoneNumber(logInParams.phoneNumber);
            if( user == null){
                throw new HttpException("bad phoneNumber or password", HttpStatus.BAD_REQUEST);  
            }

            const match = await compare(logInParams.password, user.password);
            if(!match){
                throw new HttpException("bad phoneNumber or password", HttpStatus.BAD_REQUEST);  
            }

            user.password=logInParams.password;
            return user;
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);  
        }
    }

    public async register(userCreationParams: UserCreationParams): Promise<User> {
        if(userCreationParams.phoneNumber == null || userCreationParams.password == null){
            throw new HttpException("phoneNumber and password should not be null", HttpStatus.BAD_REQUEST);  
        }

        try {
            const user = await this.userService.getUserByPhoneNumber(userCreationParams.phoneNumber);
            if( user != null){
                throw new HttpException("user already registrated", HttpStatus.CONFLICT);  
            }

            const encryptUser =await this.encryptPassword(userCreationParams);

            return this.userService.addUser(encryptUser);
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);  
        }
    }

    private async encryptPassword(user: UserCreationParams) {
        const salt = await genSalt(10);
        const encryptPassword = await hash(user.password, salt);
        user.password = encryptPassword;

        return user;
    }
}

