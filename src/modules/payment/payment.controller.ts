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
import CreatePaymentDto from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Get()
  async getListPayment(@Req() request: RequestWithUser) {
    return this.paymentService.getListPayment(request.user);
  }

  @UseGuards(RoleGuard([Role.User]))
  @ApiBearerAuth('JWT')
  @Post()
  async createPayment(
    @Req() request: RequestWithUser,
    @Body() body: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(request.user, body);
  }

  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth('JWT')
  @Get(':id')
  async cancelPayment(@Param('id') id: string) {
    // return this.paymentService.getListPayment(request.user);
  }
}
