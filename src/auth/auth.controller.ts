import { Controller, Get, Param, Post, Body, Delete, Patch } from '@nestjs/common';
import { LogInParams, UserCreationParams } from '@checkout/types';
import { AuthService } from './auth.service';

@Controller('auth')
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

    @Post('logout')
    async logOut(@Param() params) {
    }
}
