import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokenModule } from '../tokens/tokens.module';

@Module({
  imports: [DatabaseModule, UsersModule, TokenModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}