import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { User } from 'src/modules/users/schemas/user.schema';
import { PaymentStatus } from 'src/@core/constants';
import { Meeting } from 'src/modules/meetings/schemas/meetings.schema';

export type PaymentDocument = Payment & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Payment {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  source: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  destination: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Meeting.name })
  @Type(() => Meeting)
  meetingId: Meeting;

  @Prop()
  amount: number;

  @Prop()
  description: string;

  @Prop({
    default: PaymentStatus.INIT,
    enum: PaymentStatus,
  })
  paymentStatus: PaymentStatus;

  @Prop({ default: new Date() })
  createdAt: Date;
}

const PaymentSchema = SchemaFactory.createForClass(Payment);

// MessageSchema.index({ userEmail: 1 });

export { PaymentSchema };
