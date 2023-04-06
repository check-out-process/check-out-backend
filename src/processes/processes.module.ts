import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { processesProviders, processTypesProviders } from './processes.providers';
import { ProcessesService } from './processes.service';

@Module({
  imports: [DatabaseModule],
  providers: [...processesProviders, ...processTypesProviders, ProcessesService]
})
export class ProcessesModule {}
