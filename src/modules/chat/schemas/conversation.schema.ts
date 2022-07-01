import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';
import { Message } from './message.schema';

export type ConversationDocument = Conversation & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Conversation {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  content: string;

  @Prop()
  conversationId: string;

  @Prop()
  senderId: string;

  @Prop()
  receiverId: string;
}

const ConversationSchema = SchemaFactory.createForClass(Message);

// MessageSchema.index({ userEmail: 1 });

export { ConversationSchema };
