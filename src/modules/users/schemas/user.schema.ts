import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Role, UserStatus } from 'src/@core/constants';

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

  @Prop({
    default:
      'https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg',
  })
  imgUrl: string;

  @Prop()
  socketId: string;

  @Prop({
    default: 15000000,
  })
  balance: number;

  @Prop({
    default: UserStatus.ACTIVE,
    enum: UserStatus,
  })
  status: UserStatus;
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
