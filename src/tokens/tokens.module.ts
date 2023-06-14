import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';;
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { tokensProviders } from './tokens.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule)],
  providers: [...tokensProviders, TokensService ],
  controllers: [TokensController],
  exports: [TokensService]
})
export class TokenModule {}
