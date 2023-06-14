import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './tokens.entities';
import { sign, verify } from "jsonwebtoken";
import { createOrUpdateObjectFromParams } from 'src/common/utils';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokensService {

    constructor(
        @Inject('TOKEN_REPOSITORY')
        private tokensRepo: Repository<Token>,
        private usersService: UsersService
    ) { }
    public async getTokensByUserId(userId: number): Promise<Token[]> {
        return await this.tokensRepo.find({ where: { userId } });
    }

    public async getTokenById(id: string): Promise<Token> {
        return await this.tokensRepo.findOne({ where: { token: id } });
    }

    public async setTokenValue(token: string, newTokenValue: string): Promise<Token> {
        let newToken: Token = await this.getTokenById(token);
        newToken = createOrUpdateObjectFromParams(newToken, { token: newTokenValue });
        this.tokensRepo.save(newToken);
        return newToken;

    }

    public async removeAllTokenOfUserId(userId: number) {
        const tokens : Token[] = await this.getTokensByUserId(userId);
        this.tokensRepo.remove(tokens);
    }

    public async removeTokenById(id: string) {
        const token : Token = await this.getTokenById(id);
        this.tokensRepo.remove(token);
    }

    public async postTokensToUserId(userId: number, token: string): Promise<Token> {
        let newToken: Token = this.tokensRepo.create()
        newToken = createOrUpdateObjectFromParams(newToken, { token, userId});
        newToken.id = randomUUID();
        await this.tokensRepo.save(newToken);
        return newToken;
    }

    public async refreshTokens(token: string) {
        if (token == null) {
            throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }
        return await verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
            if (err) {
                throw new HttpException(err.message, HttpStatus.FORBIDDEN);
            }else{
                const userId = userInfo.id;
                try {
                    const user = await this.usersService.getUserById(userId);
                    if (user == null) {
                        throw new HttpException('invalid request', HttpStatus.FORBIDDEN);
                    }
                    if (!user.tokens.map(token => token.token).includes(token)) {
                        throw new HttpException('invalid request', HttpStatus.FORBIDDEN);
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
    
                    await this.setTokenValue(token, refreshToken);
    
                    return { accessToken, refreshToken };
                } catch (error) {
    
                }
            }
           
        });
    }
}