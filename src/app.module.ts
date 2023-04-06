import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { RoomsModule } from './rooms/rooms.module';
import { BedsModule } from './beds/beds.module';
import { SectorsModule } from './sectors/sectors.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DepartmentModule, RoomsModule, BedsModule, SectorsModule, UsersModule],

})
export class AppModule {}
