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
import { MeetingStatus, Role } from 'src/@core/constants';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import RoleGuard from '../authentication/guards/role.guard';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import CreateMeetingDto from './dto/create-meeting.dto';
import UpdateMeetingDto from './dto/updateMeeting.dto';
import { MeetingService } from './meetings.service';

@Controller()
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get('lawyer')
  async getListFreeMeetingLawyer(
    @Query('lawyerId') lawyerId: string,
    @Query('meetingDate') meetingDate: string,
  ) {
    return this.meetingService.getListFreeMeetingsByLawyerId(
      lawyerId,
      meetingDate,
    );
  }
  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Get()
  async getListMeetingUser(
    @Req() request: RequestWithUser,
    @Query('status') status: MeetingStatus,
  ) {
    return this.meetingService.getListMeetingOfUserByStatus(
      request.user,
      status,
    );
  }

  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Post()
  async createMeeting(
    @Req() request: RequestWithUser,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    return this.meetingService.createMeeting(
      createMeetingDto,
      request.user._id.toString(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth('JWT')
  @Put()
  async updateMeeting(@Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingService.updateMeeting(updateMeetingDto);
  }
}
