import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { User } from 'src/modules/users/schemas/user.schema';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  userId: User;

  @Prop()
  content: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  url: string;
}

const NotificationSchema = SchemaFactory.createForClass(Notification);

export { NotificationSchema };
