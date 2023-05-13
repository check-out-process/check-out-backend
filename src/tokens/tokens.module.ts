import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';;
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { tokensProviders } from './tokens.provider';
import { UsersService } from 'src/users/users.service';
import { usersProviders } from 'src/users/users.provides';

@Module({
  imports: [DatabaseModule],
  providers: [...tokensProviders, TokensService, UsersService, ...usersProviders ],
  controllers: [TokensController]
})
export class TokenModule {}
