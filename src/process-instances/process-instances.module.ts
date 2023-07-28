import { Module } from '@nestjs/common';
import { ProcessInstancesService } from './process-instances.service';
import { ProcessInstancesController } from './process-instances.controller';
import { DatabaseModule } from '../database/database.module';
import { processProviders, sectorInstanceProviders } from './process-instances.providers';
import { ProcessTemplatesModule } from '../process-templates/process-templates.module';
import { BedsModule } from '../beds/beds.module';
import { RoomsModule } from '../rooms/rooms.module';
import { DepartmentModule } from '../department/department.module';
import { UsersModule } from '../users/users.module';
import { SectorsModule } from '../sectors/sectors.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [DatabaseModule, BedsModule, RoomsModule, DepartmentModule, UsersModule,SectorsModule, ProcessTemplatesModule,SmsModule],
  providers: [...processProviders, ...sectorInstanceProviders, ProcessInstancesService],
  controllers: [ProcessInstancesController]
})
export class ProcessInstancesModule { }
