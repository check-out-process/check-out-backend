import { Controller,Post, Body, Delete, Headers } from '@nestjs/common';
import { LogInParams, UserCreationParams } from '@checkout/types';
import { AuthService } from './auth.service';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('auth')
@ApiExcludeController()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async logIn(@Body() data: LogInParams) {
        return await this.authService.login(data);
    }

    @Post('register')
    async register(@Body() data: UserCreationParams) {
        return await this.authService.register(data);
    }

    @Delete('logout')
    async logOut(@Headers() headers) {
        return await this.authService.logout(headers["x-access-token"]);
    }

    @Post('token/refresh')
    public async refreshTokens(@Body() data: any) {
        return await this.authService.refreshTokens(data.token);
    }
}
