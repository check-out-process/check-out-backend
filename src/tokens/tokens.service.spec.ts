import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { TokensService } from '../tokens/tokens.service';
import { Token } from './tokens.entities';

class MockTokenRepository {
    findOne = jest.fn();
    find = jest.fn();
    remove = jest.fn();
    save = jest.fn();
    create = jest.fn();
}

describe('TokensService', () => {
    let tokensService: TokensService;
    let tokenRepository: MockTokenRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                TokensService,
                {
                    provide: getRepositoryToken(Token),
                    useClass: Repository,
                },
                {
                    provide: 'TOKEN_REPOSITORY',
                    useClass: MockTokenRepository,
                }
            ],
        }).compile();

        tokensService = moduleRef.get<TokensService>(TokensService);
        tokenRepository = moduleRef.get<MockTokenRepository>('TOKEN_REPOSITORY');

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(tokensService).toBeDefined();
    });


    describe('getTokensByUserId', () => {
        it('should return an array of tokens for the given user ID', async () => {
            // Arrange
            const userId = 1;
            const mockTokens: Token[] = [
                { id: '1', userId: 1, token: 'token1' },
                { id: '2', userId: 1, token: 'token2' },
            ];
            tokenRepository.find.mockResolvedValue(mockTokens);

            // Act
            const result = await tokensService.getTokensByUserId(userId);

            // Assert
            expect(result).toEqual(mockTokens);
            expect(tokenRepository.find).toHaveBeenCalledWith({ where: { userId } });
        });
    });

    describe('getTokenById', () => {
        it('should return a token for the given token ID', async () => {
            // Arrange
            const tokenId = '1';
            const mockToken: Token = { id: tokenId, userId: 1, token: 'token1' };
            tokenRepository.findOne.mockResolvedValue(mockToken);

            // Act
            const result = await tokensService.getTokenById(tokenId);

            // Assert
            expect(result).toEqual(mockToken);
            expect(tokenRepository.findOne).toHaveBeenCalledWith({ where: { token: tokenId } });
        });
    });

    describe('setTokenValue', () => {
        it('should update the token value and return the updated token', async () => {
            // Arrange
            const tokenId = '1';
            const newTokenValue = 'new-token-value';
            const mockToken: Token = { id: tokenId, userId: 1, token: 'old-token-value' };
            tokenRepository.findOne.mockResolvedValue(mockToken);
            tokenRepository.save.mockResolvedValue(mockToken);

            // Act
            const result = await tokensService.setTokenValue(tokenId, newTokenValue);

            // Assert
            expect(result).toEqual(mockToken);
            expect(mockToken.token).toBe(newTokenValue);
            expect(tokenRepository.findOne).toHaveBeenCalledWith({ where: { token: tokenId } });
            expect(tokenRepository.save).toHaveBeenCalledWith(mockToken);
        });
    });

    describe('removeAllTokenOfUserId', () => {
        it('should remove all tokens of the given user ID', async () => {
            // Arrange
            const userId = 1;
            const mockTokens: Token[] = [
                { id: '1', userId: 1, token: 'token1' },
                { id: '2', userId: 1, token: 'token2' },
            ];
            jest.spyOn(tokensService, 'getTokensByUserId').mockResolvedValue(mockTokens);
            tokenRepository.remove.mockResolvedValue(undefined);

            // Act
            await tokensService.removeAllTokenOfUserId(userId);

            // Assert
            expect(tokensService.getTokensByUserId).toHaveBeenCalledWith(userId);
            expect(tokenRepository.remove).toHaveBeenCalledWith(mockTokens);
        });
    });

    describe('removeTokenById', () => {
        it('should remove the token with the given ID', async () => {
            // Arrange
            const tokenId = '1';
            const mockToken: Token = { id: tokenId, userId: 1, token: 'token1' };
            jest.spyOn(tokensService, 'getTokenById').mockResolvedValue(mockToken);
            tokenRepository.remove.mockResolvedValue(undefined);

            // Act
            await tokensService.removeTokenById(tokenId);

            // Assert
            expect(tokensService.getTokenById).toHaveBeenCalledWith(tokenId);
            expect(tokenRepository.remove).toHaveBeenCalledWith(mockToken);
        });
    });

    describe('postTokensToUserId', () => {
        it('should create and save a new token for the given user ID', async () => {
            // Arrange
            const userId = 1;
            const tokenValue = 'new-token';
            const mockNewToken: Token = { id: 'random-id', userId, token: tokenValue };
            tokenRepository.create.mockResolvedValue(mockNewToken);
            tokenRepository.save.mockResolvedValue(mockNewToken);

            // Act
            const result = await tokensService.postTokensToUserId(userId, tokenValue);

            // Assert
            expect(result).toEqual(mockNewToken);
            expect(tokenRepository.create).toHaveBeenCalled();
        });
    });
});


