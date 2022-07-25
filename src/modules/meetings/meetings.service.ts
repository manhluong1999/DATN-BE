import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from './schemas/meetings.schema';
import moment from 'moment';
import { difference } from 'lodash';
import CreateMeetingDto from './dto/create-meeting.dto';
import { MeetingStatus, PaymentStatus, Role } from 'src/@core/constants';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import UpdateMeetingDto from './dto/updateMeeting.dto';
import { Payment, PaymentDocument } from '../payment/schemas/payment.schema';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private model: Model<MeetingDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly userService: UsersService,
  ) {}

  getDataByTimeCode(timeCode: number, meetingDate: string) {
    const startHour = (timeCode - 1) * 2 + 8;
    const endHour = startHour + 2;
    const startAt = new Date(meetingDate);
    const endAt = new Date(meetingDate);
    startAt.setHours(startHour, 0, 0, 0);
    endAt.setHours(endHour, 0, 0, 0);
    return {
      startAt,
      endAt,
    };
  }
  async getListMeetingOfUserByStatus(user: User, status: MeetingStatus) {
    let listMeetings;
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (user.role == Role.Lawyer) {
      filter.lawyerId = user._id;
      listMeetings = await this.model.find(filter).populate('userId');
    } else {
      filter.userId = user._id;
      listMeetings = await this.model.find(filter).populate('lawyerId');
    }
    return listMeetings;
  }
  async getListFreeMeetingsByLawyerId(lawyerId: string, meetingDate: string) {
    const listResult = [1, 2, 3, 4, 5];
    const listMeetings = await this.model.find({ lawyerId, meetingDate });
    const listMeetingCode = [];
    for (const meeting of listMeetings) {
      const { timeCode } = meeting;
      listMeetingCode.push(timeCode);
    }
    return difference(listResult, listMeetingCode);
  }
  async createMeeting(createMeetingDto: CreateMeetingDto, userId) {
    const { lawyerId, meetingDate, timeCode } = createMeetingDto;

    const findLawyer = await this.userService.getById(lawyerId);

    if (!findLawyer || findLawyer.role != Role.Lawyer) {
      return {
        isSuccess: false,
        message: 'Lawyer id is not valid',
      };
    }
    if (timeCode > 5 || timeCode < 1) {
      return {
        isSuccess: false,
        message: 'Time code is not valid',
      };
    }

    const { startAt, endAt } = this.getDataByTimeCode(timeCode, meetingDate);
    const check = await this.model.findOne({ timeCode, lawyerId, meetingDate });
    if (check) {
      return {
        isSuccess: false,
        message: 'Time code is existed',
      };
    }
    const newMeeting = await this.model.create({
      lawyerId,
      userId,
      meetingDate,
      startAt,
      endAt,
      timeCode,
    });

    return newMeeting;
  }

  async findOne(meetingId: string) {
    return await this.model
      .findById(meetingId)
      .populate('userId')
      .populate('lawyerId');
  }
  async updateMeeting(body: UpdateMeetingDto) {
    const meeting = await this.model
      .findOne({ id: body.meetingId })
      .populate('lawyerId');
    if (body.status == MeetingStatus.FINISHED) {
      const newBalance = meeting.price + meeting.lawyerId.balance;
      await Promise.all([
        this.userService.userModel.findByIdAndUpdate(meeting.lawyerId._id, {
          balance: newBalance,
        }),
        this.paymentModel.findOneAndUpdate(
          { meetingId: body.meetingId },
          { $set: { paymentStatus: PaymentStatus.FINISHED } },
        ),
      ]);
    }
    return this.model.findByIdAndUpdate(body.meetingId, body, { new: true });
  }
}
