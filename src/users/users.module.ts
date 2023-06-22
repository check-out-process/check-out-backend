import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { usersProviders } from './users.provides';
import { JobsModule } from 'src/jobs/jobs.module';
import { RolesModule } from 'src/roles/roles.module';
import { SectorsModule } from 'src/sectors/sectors.module';
import { TokenModule } from 'src/tokens/tokens.module';

@Module({
  imports: [DatabaseModule, JobsModule, RolesModule, SectorsModule, TokenModule],
  providers: [...usersProviders, UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
