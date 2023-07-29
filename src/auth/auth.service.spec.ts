import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { createMock } from '@golevelup/ts-jest';
import { LogInParams, UserCreationParams } from '@checkout/types';
import { HttpException, HttpStatus } from '@nestjs/common';

class MockUsersService {
    getUserByPhoneNumber = jest.fn();
}

describe('Auth Service', () => {
    let service: AuthService;
    let usersService: MockUsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService,
                { provide: UsersService, useValue: MockUsersService },
                { provide: TokensService, useValue: createMock<TokensService>() },

            ],
        }).compile();
        service = module.get<AuthService>(AuthService);
        usersService = module.get<MockUsersService>(UsersService);

    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        let logInParams: LogInParams;

        beforeEach(() => {
            logInParams = {
                phoneNumber: 'string',
                password: 'string',
                tokens: []
            }
        })

        it('should throw error when phoneNumber is null', async () => {
            // Arrange
            logInParams.phoneNumber = null;

            // Act + Assert
            await expect(service.login(logInParams)).rejects.toEqual(new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND));
        });

        it('should throw error when password is null', async () => {
            // Arrange
            logInParams.password = null;


            // Act + Assert
            await expect(service.login(logInParams)).rejects.toEqual(new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND));
        });

        it('should throw error when getUserByPhoneNumber return null', async () => {
            // Arrange
            usersService.getUserByPhoneNumber = jest.fn(null);

            // Act + Assert
            await expect(service.login(logInParams)).rejects.toEqual(new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND));
        });

        it('should throw error when logInParams password not match user password', async () => {
            // Arrange
            const expectedUser = {
                id: 1,
                fullname: 'afek lev',
                username: 'afek lev',
                phoneNumber: '0527364455',
                password: '',
                job: {
                    id: '',
                    name: ''
                },
                role: {
                    id: '',
                    name: ''
                },
                sectors: undefined,
                sectors_in_responsibility: undefined
            };
            usersService.getUserByPhoneNumber.mockResolvedValue(expectedUser);

            // Act + Assert
            await expect(service.login(logInParams)).rejects.toEqual(new HttpException("phoneNumber or password not correct", HttpStatus.NOT_FOUND));
        });
    })

    describe('register', () => {
        let userCreationParams: UserCreationParams;

        beforeEach(() => {
            userCreationParams = {
                id: 1,
                fullname: 'string',
                username: 'string',
                password: 'string',
                jobId: 'string',
                roleId: 'string',
                phoneNumber: 'string'
            }
        })

        it('should throw error when phoneNumber is null', async () => {
            // Arrange
            userCreationParams.phoneNumber = null;

            // Act + Assert
            await expect(service.register(userCreationParams)).rejects.toEqual(new HttpException("phoneNumber and password should not be null", HttpStatus.BAD_REQUEST));
        });

        it('should throw error when password is null', async () => {
            // Arrange
            userCreationParams.password = null;

            // Act + Assert
            await expect(service.register(userCreationParams)).rejects.toEqual(new HttpException("phoneNumber and password should not be null", HttpStatus.BAD_REQUEST));
        });

        it('should throw error when getUserByPhoneNumber not return null', async () => {
            // Arrange
            const expectedUser = {
                id: 1,
                fullname: 'afek lev',
                username: 'afek lev',
                phoneNumber: '0527364455',
                password: '',
                job: {
                    id: '',
                    name: ''
                },
                role: {
                    id: '',
                    name: ''
                },
                sectors: undefined,
                sectors_in_responsibility: undefined
            };
            usersService.getUserByPhoneNumber.mockResolvedValue(expectedUser);

            // Act + Assert
            await expect(service.register(userCreationParams)).rejects.toEqual(new HttpException("user already registrated", HttpStatus.CONFLICT));
        });
    })

    describe('logout', () => {
        it('should throw error when token is null', async () => {
            await expect(service.logout(null)).rejects.toEqual(new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED));
        });
    })

    describe('refreshTokens', () => {
        it('should throw error when token is null', async () => {
            await expect(service.logout(null)).rejects.toEqual(new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED));
        });
    })
});