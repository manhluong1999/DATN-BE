import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type NotificationDocument = Notification & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Notification {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  userId: string;
}

const NotificationSchema = SchemaFactory.createForClass(Notification);

export { NotificationSchema };
