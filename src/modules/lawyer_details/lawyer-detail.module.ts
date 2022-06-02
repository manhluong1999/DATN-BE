import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LawyerDetailService } from './lawyer-detail.service';
import {
  LawyerDetail,
  LawyerDetailSchema,
} from './schemas/lawyer-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LawyerDetail.name, schema: LawyerDetailSchema },
    ]),
  ],
  providers: [LawyerDetailService],
  exports: [LawyerDetailService],
})
export class LawyerDetailModule {}
