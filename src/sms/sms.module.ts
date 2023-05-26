import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SmsService } from 'src/sms/sms.service';

@Module({
  imports: [],
  providers: [SmsService],
  controllers: [],
  exports: [SmsService]
})
export class SmsModule {}
