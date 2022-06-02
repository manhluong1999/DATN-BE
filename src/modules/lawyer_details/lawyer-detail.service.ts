import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  LawyerDetail,
  LawyerDetailDocument,
} from './schemas/lawyer-detail.schema';
import CreateLawyerDto from './dtos/createLawyer.dto';
import UpdateLawyerDto from './dtos/updateLawyer.dto';
import CreateUserDto from '../users/dto/createUser.dto';

@Injectable()
export class LawyerDetailService {
  constructor(
    @InjectModel(LawyerDetail.name) private model: Model<LawyerDetailDocument>,
  ) {}

  async create(createLawyerDto: CreateLawyerDto | CreateUserDto) {
    const createdLawyer = new this.model({
      ...createLawyerDto,
      userEmail: createLawyerDto.email,
    });
    return createdLawyer.save();
  }

  async update(updateLawyerDto: UpdateLawyerDto) {
    return this.model.updateOne({});
  }

  async findByEmail(email: string) {
    return this.model.findOne({ userEmail: email });
  }
}
