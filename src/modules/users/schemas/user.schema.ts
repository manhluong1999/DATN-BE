import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Role } from 'src/@core/constants';

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

  @Prop({
    default: Role.User,
    enum: Role,
  })
  role: Role;

  @Prop()
  firstName: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  @Exclude()
  currentHashedRefreshToken: string;

  @Prop()
  lastName: string;

  @Prop()
  fullName: string;

  @Prop()
  phone: string;

  @Prop()
  fax: string;

  @Prop()
  address: string;

  @Prop()
  imgUrl: string;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    delete ret['currentHashedRefreshToken'];
    return ret;
  },
});
UserSchema.index({ email: 1 });

export { UserSchema };
