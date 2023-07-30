import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockImplementation((data) => {
              return { accessToken: 'token123', refreshToken: 'refresh123' };
            }),
            register: jest.fn().mockImplementation((data) => {
              return { id: 1, username: data.username };
            }),
            logout: jest.fn().mockImplementation((token) => {
              return { message: `Logged out user with token: ${token}` };
            }),
            refreshTokens: jest.fn().mockImplementation((token) => {
              return { accessToken: 'new-token-123', refreshToken: 'new-refresh-123' };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('logIn', () => {
    it('should return access and refresh tokens after login', async () => {
      const data: any = { username: 'testuser', password: 'testpassword' };
      const result = await controller.logIn(data);
      expect(result).toEqual({ accessToken: 'token123', refreshToken: 'refresh123' });
      expect(authService.login).toHaveBeenCalledWith(data);
    });
  });

  describe('register', () => {
    it('should return the registered user information', async () => {
      const data: any = { username: 'newuser', password: 'newpassword' };
      const result = await controller.register(data);
      expect(result).toEqual({ id: 1, username: 'newuser' });
      expect(authService.register).toHaveBeenCalledWith(data);
    });
  });

  describe('logOut', () => {
    it('should log out the user with the provided access token', async () => {
      const headers = { 'x-access-token': 'test-access-token' };
      const result = await controller.logOut(headers);
      expect(result).toEqual({ message: 'Logged out user with token: test-access-token' });
      expect(authService.logout).toHaveBeenCalledWith(headers['x-access-token']);
    });
  });

  describe('refreshTokens', () => {
    it('should return new access and refresh tokens', async () => {
      const data = { token: 'old-token-123' };
      const result = await controller.refreshTokens(data);
      expect(result).toEqual({ accessToken: 'new-token-123', refreshToken: 'new-refresh-123' });
      expect(authService.refreshTokens).toHaveBeenCalledWith(data.token);
    });
  });
});
