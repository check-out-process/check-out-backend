import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './tokens.entities';
import { sign, verify } from "jsonwebtoken";
import { createOrUpdateObjectFromParams } from '../common/utils';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokensService {

    constructor(
        @Inject('TOKEN_REPOSITORY')
        private tokensRepo: Repository<Token>,
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
        await this.tokensRepo.save(newToken);
        return newToken;

    }

    public async removeAllTokenOfUserId(userId: number) {
        const tokens : Token[] = await this.getTokensByUserId(userId);
        await this.tokensRepo.remove(tokens);
    }

    public async removeTokenById(id: string) {
        const token : Token = await this.getTokenById(id);
        await this.tokensRepo.remove(token);
    }

    public async postTokensToUserId(userId: number, token: string): Promise<Token> {
        let newToken: Token = this.tokensRepo.create()
        newToken = createOrUpdateObjectFromParams(newToken, { token, userId});
        newToken.id = randomUUID();
        await this.tokensRepo.save(newToken);
        return newToken;
    }

   
}