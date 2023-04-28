import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { usersProviders } from './users.provides';
import { JobsModule } from 'src/jobs/jobs.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [DatabaseModule],
  providers: [...usersProviders, UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
