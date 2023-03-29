import { Module } from '@nestjs/common';
import { BedsService } from './beds.service';
import { BedsController } from './beds.controller';

@Module({
  providers: [BedsService],
  controllers: [BedsController]
})
export class BedsModule {}
