import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { rolesProviders } from './roles.providers';

@Module({
  imports: [DatabaseModule],
  providers: [RolesService, ...rolesProviders],
  controllers: [RolesController]
})
export class RolesModule {}
