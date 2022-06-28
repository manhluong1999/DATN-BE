import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/@core/constants';
import RoleGuard from '../authentication/guards/role.guard';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import CreateMeetingDto from './dto/create-meeting.dto';
import { MeetingService } from './meetings.service';

@Controller()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get()
  async getListFreeMeeting(
    @Query('lawyerId') lawyerId: string,
    @Query('meetingDate') meetingDate: string,
  ) {
    return this.meetingService.getListFreeMeetingsByLawyerId(
      lawyerId,
      meetingDate,
    );
  }

  @UseGuards(RoleGuard([Role.User]))
  @ApiBearerAuth('JWT')
  @Post()
  async createMeeting(
    @Req() request: RequestWithUser,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    return this.meetingService.createMeeting(
      createMeetingDto,
      request.user._id,
    );
  }
}
