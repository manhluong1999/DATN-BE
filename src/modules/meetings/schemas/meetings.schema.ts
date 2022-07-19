import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { MeetingStatus } from 'src/@core/constants';
import { User } from 'src/modules/users/schemas/user.schema';

export type MeetingDocument = Meeting & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Meeting {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  lawyerId: User;

  @Prop()
  meetingDate: string;

  @Prop({
    default: MeetingStatus.PENDING,
    enum: MeetingStatus,
  })
  status: MeetingStatus;

  @Prop()
  timeCode: number;

  @Prop()
  price: number;

  @Prop()
  startAt: Date;

  @Prop()
  endAt: Date;
}

const MeetingSchema = SchemaFactory.createForClass(Meeting);

MeetingSchema.index({ userId: 1, lawyerId: 1 });

export { MeetingSchema };
