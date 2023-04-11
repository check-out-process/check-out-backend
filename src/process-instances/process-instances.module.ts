import { Module } from '@nestjs/common';
import { ProcessInstancesService } from './process-instances.service';
import { ProcessInstancesController } from './process-instances.controller';
import { DatabaseModule } from 'src/database/database.module';
import { processProviders } from './process-instances.providers';
import { ProcessTemplatesModule } from 'src/process-templates/processes.module';

@Module({
  imports: [DatabaseModule, ProcessTemplatesModule],
  providers: [...processProviders, ProcessInstancesService],
  controllers: [ProcessInstancesController]
})
export class ProcessInstancesModule {}
