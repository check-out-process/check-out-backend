import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.provides';
import { JobsModule } from '../jobs/jobs.module';
import { RolesModule } from '../roles/roles.module';
import { SectorsModule } from '../sectors/sectors.module';
import { TokenModule } from '../tokens/tokens.module';

@Module({
  imports: [DatabaseModule, JobsModule, RolesModule, SectorsModule, TokenModule],
  providers: [...usersProviders, UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
