import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProcessTemplatesController } from './process-templates.controller';
import { processTemplatesProviders, processTypesProviders } from './process-templates.providers';
import { ProcessTemplatesService } from './process-templates.service';

@Module({
  imports: [DatabaseModule],
  providers: [...processTemplatesProviders, ...processTypesProviders, ProcessTemplatesService],
  controllers: [ProcessTemplatesController],
  exports: [ProcessTemplatesService]
})
export class ProcessTemplatesModule {}
