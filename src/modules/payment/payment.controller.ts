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

@Controller()
export class PaymentController {
  constructor() {}
}
