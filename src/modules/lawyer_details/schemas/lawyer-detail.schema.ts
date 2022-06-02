import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Role } from 'src/@core/constants';

export type LawyerDetailDocument = LawyerDetail & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class LawyerDetail {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  userEmail: string;

  @Prop()
  majorFields: Array<string>;

  @Prop()
  description: string;

  @Prop()
  ratingScore: number;

  @Prop()
  yearExperiences: number;

  @Prop()
  userRatesScore: number;
}

const LawyerDetailSchema = SchemaFactory.createForClass(LawyerDetail);

LawyerDetailSchema.index({ userEmail: 1 });

export { LawyerDetailSchema };
