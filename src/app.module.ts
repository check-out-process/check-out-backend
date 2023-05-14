import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { RoomsModule } from './rooms/rooms.module';
import { BedsModule } from './beds/beds.module';
import { SectorsModule } from './sectors/sectors.module';
import { UsersModule } from './users/users.module';
import { ProcessTemplatesModule } from './process-templates/process-templates.module';
import { ProcessInstancesModule } from './process-instances/process-instances.module';
import { JobsModule } from './jobs/jobs.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { AuthrMiddleware } from './middleware/auth.middleware';
import { TokenModule } from './tokens/tokens.module';

@Module({
  imports: [AuthModule, TokenModule, DepartmentModule, RoomsModule, BedsModule, SectorsModule, UsersModule, ProcessTemplatesModule, ProcessInstancesModule, JobsModule, RolesModule],
  controllers: [],

})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthrMiddleware).exclude('auth/(.*)').forRoutes('*')
  }
}
