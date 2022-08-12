import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { LawyerDetailModule } from '../lawyer_details/lawyer-detail.module';
import { FirebaseStorageModule } from '../firebase-storage/firebase-storage.module';
import { Meeting, MeetingSchema } from '../meetings/schemas/meetings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
    LawyerDetailModule,
    FirebaseStorageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
