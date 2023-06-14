import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { UsersService } from 'src/users/users.service';
import { genSalt, hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { LogInParams, UserCreationParams } from '@checkout/types';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokenService: TokensService

    ) { }

    public async login(logInParams: LogInParams) {
        if (logInParams.phoneNumber == null || logInParams.password == null) {
            throw new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND);
        }

        try {
            const user = await this.userService.getUserByPhoneNumber(logInParams.phoneNumber);
            if (user == null) {
                throw new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND);
            }

            const match = await compare(logInParams.password, user.password);
            if (!match) {
                throw new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND);
            }

            const accessToken = sign(
                { id: user.id, phoneNumber: user.phoneNumber },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
            );
            const refreshToken = sign(
                { id: user.id, phoneNumber: user.phoneNumber },
                process.env.REFRESH_TOKEN_SECRET,
            );

            await this.tokenService.postTokensToUserId(user.id, refreshToken);

            user.password = logInParams.password;

            return { ...user, accessToken, refreshToken };
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async register(userCreationParams: UserCreationParams) {
        if (userCreationParams.phoneNumber == null || userCreationParams.password == null) {
            throw new HttpException("phoneNumber and password should not be null", HttpStatus.BAD_REQUEST);
        }

        try {
            const user = await this.userService.getUserByPhoneNumber(userCreationParams.phoneNumber);
            if (user != null) {
                throw new HttpException("user already registrated", HttpStatus.CONFLICT);
            }

            const encryptPassword = await this.encryptPassword(userCreationParams);
            userCreationParams.password = encryptPassword;

            return await this.userService.addUser(userCreationParams)
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async logout(token: string) {
        if (token == null) {
            throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }
        return await verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
            if (err) {
                throw new HttpException(err.message, HttpStatus.FORBIDDEN);
            } else {
                const userId = userInfo.id;
                try {
                    const user = await this.userService.getUserById(userId);
                    if (user == null) {
                        throw new HttpException('invalid request', HttpStatus.FORBIDDEN);
                    }
                    if (!user.tokens.map(token => token.token).includes(token)) {
                        throw new HttpException('invalid request', HttpStatus.FORBIDDEN);
                    }

                    await this.tokenService.removeTokenById(token);

                } catch (error) {

                }
            }

        });
    }

    private async encryptPassword(user: UserCreationParams) {
        const salt = await genSalt(10);

        return await hash(user.password, salt);
    }
}

