import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { User } from 'src/modules/users/schemas/user.schema';

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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  @Type(() => User)
  listUserIds: User;
}

const ConversationSchema = SchemaFactory.createForClass(Conversation);

// MessageSchema.index({ userEmail: 1 });

export { ConversationSchema };
