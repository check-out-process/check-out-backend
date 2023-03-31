import { Module } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { SectorsController } from './sectors.controller';
import { DatabaseModule } from 'src/database/database.module';
import { sectorsProviders } from './sectors.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...sectorsProviders, SectorsService],
  controllers: [SectorsController]
})
export class SectorsModule {}
