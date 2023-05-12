import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { usersProviders } from 'src/users/users.provides';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService, UsersService, ...usersProviders],
  controllers: [AuthController]
})
export class AuthModule {}