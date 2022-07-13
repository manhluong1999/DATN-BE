import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

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

  @Prop()
  source: string;

  @Prop()
  destination: string;

  @Prop()
  amount: number;

  @Prop()
  description: string;
}

const PaymentSchema = SchemaFactory.createForClass(Payment);

// MessageSchema.index({ userEmail: 1 });

export { PaymentSchema };
