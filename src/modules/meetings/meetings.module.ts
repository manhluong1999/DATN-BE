import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from '../payment/payment.module';
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';
import { UsersModule } from '../users/users.module';
import { MeetingController } from './meetings.controller';
import { MeetingService } from './meetings.service';
import { Meeting, MeetingSchema } from './schemas/meetings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    UsersModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService],
})
export class MeetingModule {}
