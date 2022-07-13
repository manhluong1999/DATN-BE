import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

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

  @Prop()
  name: string;

  @Prop()
  roomId: string;

  @Prop()
  listUserIds: Array<string>;
}

const ConversationSchema = SchemaFactory.createForClass(Conversation);

// MessageSchema.index({ userEmail: 1 });

export { ConversationSchema };
