import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DepartmentController } from './department.controller';
import { departmentProviders } from './department.providers';
import { DepartmentService } from './department.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartmentController],
  providers: [...departmentProviders, DepartmentService],
  exports: [DepartmentService]
})
export class DepartmentModule {}
