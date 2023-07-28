import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { createMock } from '@golevelup/ts-jest';
import { LogInParams } from '@checkout/types';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Auth Service', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService,
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: TokensService, useValue: createMock<TokensService>() },

            ],
        }).compile();
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('login with null phoneNumber should throw error', async () => {
        const logInParams: LogInParams = {
            phoneNumber: null,
            password: 'string',
            tokens: []
        }
        await expect(service.login(logInParams)).rejects.toEqual(new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND));

    });

    it('login with null password should throw error', async () => {
        const logInParams: LogInParams = {
            phoneNumber: 'string',
            password: null,
            tokens: []
        }
        await expect(service.login(logInParams)).rejects.toEqual(new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND));

    });
});