import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { User } from 'src/modules/users/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Message {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  content: string;

  @Prop()
  conversationId: string;

  @Prop()
  senderId: string;
}

const MessageSchema = SchemaFactory.createForClass(Message);

// MessageSchema.index({ userEmail: 1 });

export { MessageSchema };
