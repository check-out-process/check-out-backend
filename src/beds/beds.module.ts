import { Module } from '@nestjs/common';
import { BedsService } from './beds.service';
import { BedsController } from './beds.controller';
import { DatabaseModule } from 'src/database/database.module';
import { bedsProviders } from './beds.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...bedsProviders, BedsService],
  controllers: [BedsController],
  exports: [BedsService]
})
export class BedsModule {}
