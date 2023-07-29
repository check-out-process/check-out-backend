import { Body, Controller, Post } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('auth/token')
export class TokensController {
    constructor(private tokensService: TokensService) { }

    @Post('refresh')
    public async refreshTokens(@Body() data: any) {
        return await this.tokensService.refreshTokens(data.token);
    }
}
