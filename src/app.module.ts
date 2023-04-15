import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { RoomsModule } from './rooms/rooms.module';
import { BedsModule } from './beds/beds.module';
import { SectorsModule } from './sectors/sectors.module';
import { UsersModule } from './users/users.module';
import { ProcessTemplatesModule } from './process-templates/process-templates.module';
import { ProcessInstancesModule } from './process-instances/process-instances.module';

@Module({
  imports: [DepartmentModule, RoomsModule, BedsModule, SectorsModule, UsersModule, ProcessTemplatesModule, ProcessInstancesModule],
  controllers: [],

})
export class AppModule {}
