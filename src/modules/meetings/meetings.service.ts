import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from './schemas/meetings.schema';
import moment from 'moment';
import { difference } from 'lodash';
import CreateMeetingDto from './dto/create-meeting.dto';
import { MeetingStatus } from 'src/@core/constants';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private model: Model<MeetingDocument>,
  ) {}

  getTimeCodeByStartTime(startTime: Date) {
    const code = (startTime.getHours() - 8) / 2 + 1;
    return code;
  }
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
  async getListMeetingOfUserByStatus(userId, status: MeetingStatus) {
    console.log(userId);
    const listMeetings = await this.model.find({ userId, status });
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

    if (timeCode > 5 || timeCode < 1) {
      return {
        isSuccess: false,
        message: 'Time code not valid',
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
    await this.model.create({
      lawyerId,
      userId,
      meetingDate,
      startAt,
      endAt,
      timeCode,
    });
    return {
      isSuccess: true,
    };
  }
}
