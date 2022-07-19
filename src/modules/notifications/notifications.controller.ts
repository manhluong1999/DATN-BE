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
import RoleGuard from '../authentication/guards/role.guard';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import { NotificationService } from './notifications.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Get()
  async getListNotifications(@Req() request: RequestWithUser) {
    const userId = request.user._id.toString();
  }
}
