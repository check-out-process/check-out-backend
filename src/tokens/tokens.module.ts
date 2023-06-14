import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';;
import { TokensService } from './tokens.service';
import { tokensProviders } from './tokens.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [...tokensProviders, TokensService ],
  controllers: [],
  exports: [TokensService]
})
export class TokenModule {}
