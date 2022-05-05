import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  fullName: string;

  @Prop()
  uid: string

  @Prop()
  phone: string

  @Prop()
  fax: string

  @Prop()
  address: string

  @Prop()
  imgUrl: string
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 'text' });

export { UserSchema };
