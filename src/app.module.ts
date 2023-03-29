import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { RoomsModule } from './rooms/rooms.module';
import { BedsModule } from './beds/beds.module';

@Module({
  imports: [DepartmentModule, RoomsModule, BedsModule],

})
export class AppModule {}
