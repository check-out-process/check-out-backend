import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { DatabaseModule } from '../database/database.module';
import { jobsProviders } from './jobs.providers';

@Module({
  imports: [DatabaseModule],
  providers: [JobsService, ...jobsProviders],
  controllers: [JobsController],
  exports: [JobsService]
})
export class JobsModule {}
