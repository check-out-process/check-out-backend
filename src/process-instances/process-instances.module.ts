import { Module } from '@nestjs/common';
import { ProcessInstancesService } from './process-instances.service';
import { ProcessInstancesController } from './process-instances.controller';
import { DatabaseModule } from 'src/database/database.module';
import { processProviders, sectorInstanceProviders } from './process-instances.providers';
import { ProcessTemplatesModule } from 'src/process-templates/process-templates.module';
import { BedsModule } from 'src/beds/beds.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { DepartmentModule } from 'src/department/department.module';
import { UsersModule } from 'src/users/users.module';
import { SectorsModule } from 'src/sectors/sectors.module';

@Module({
  imports: [DatabaseModule, BedsModule, RoomsModule, DepartmentModule, UsersModule,SectorsModule, ProcessTemplatesModule],
  providers: [...processProviders, ...sectorInstanceProviders, ProcessInstancesService],
  controllers: [ProcessInstancesController]
})
export class ProcessInstancesModule { }
