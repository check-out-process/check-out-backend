import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { createMock } from '@golevelup/ts-jest';

describe('Auth Service', () => {
    let service: AuthService;
    let usersService: UsersService;
    let tokensService: TokensService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService,
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: TokensService, useValue: createMock<TokensService>() },

            ],
        }).compile();
        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        tokensService = module.get<TokensService>(TokensService);
    });

    it('ApiService - should be defined', () => {
        expect(service).toBeDefined();
    });
});