import { Module } from '@nestjs/common';
import { ProcessInstancesService } from './process-instances.service';
import { ProcessInstancesController } from './process-instances.controller';
import { DatabaseModule } from 'src/database/database.module';
import { processProviders, sectorInstanceProviders } from './process-instances.providers';
import { ProcessTemplatesModule } from 'src/process-templates/process-templates.module';
import { ProcessTemplatesService } from 'src/process-templates/process-templates.service';

@Module({
  imports: [DatabaseModule],
  providers: [...processProviders, ...sectorInstanceProviders, ProcessInstancesService],
  controllers: [ProcessInstancesController]
})
export class ProcessInstancesModule {}
