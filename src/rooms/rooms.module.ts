import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { DatabaseModule } from 'src/database/database.module';
import { roomsProviders } from './rooms.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoomsController],
  providers: [...roomsProviders, RoomsService],
  exports: [RoomsService]
})
export class RoomsModule {}
