import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Meeting, MeetingDocument } from './schemas/meetings.schema';
import moment from 'moment';
import { difference } from 'lodash';
import CreateMeetingDto from './dto/create-meeting.dto';

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
  async getListFreeMeetingsByLawyerId(lawyerId: string, meetingDate: string) {
    const listResult = [1, 2, 3, 4, 5];
    const listMeetings = await this.model.find({ lawyerId, meetingDate });
    const listMeetingCode = [];
    for (const meeting of listMeetings) {
      const { startAt } = meeting;
      const timeCode = this.getTimeCodeByStartTime(startAt);
      listMeetingCode.push(timeCode);
    }
    return difference(listResult, listMeetingCode);
  }
  async createMeeting(createMeetingDto: CreateMeetingDto, userId) {
    const { lawyerId, meetingDate, timeCode } = createMeetingDto;
    const { startAt, endAt } = this.getDataByTimeCode(timeCode, meetingDate);
    await this.model.create({
      lawyerId,
      userId,
      meetingDate,
      startAt,
      endAt,
    });
  }
}
