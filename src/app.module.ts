import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [DepartmentModule, RoomsModule],

})
export class AppModule {}
