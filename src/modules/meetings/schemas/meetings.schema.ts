import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

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

  @Prop()
  userId: string;

  @Prop()
  lawyerId: string;

  @Prop()
  meetingDate: string;

  @Prop()
  startAt: Date;

  @Prop()
  endAt: Date;
}

const MeetingSchema = SchemaFactory.createForClass(Meeting);

MeetingSchema.index({ userId: 1, lawyerId: 1 });

export { MeetingSchema };
