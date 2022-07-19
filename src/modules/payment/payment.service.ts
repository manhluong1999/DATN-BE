import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { MeetingStatus, PaymentStatus, Role } from 'src/@core/constants';
import { User, UserDocument } from '../users/schemas/user.schema';
import CreatePaymentDto from './dto/create-payment.dto';
import { MeetingService } from '../meetings/meetings.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly meetingService: MeetingService,
  ) {}

  async getListPayment(user: User) {
    let listPayments;
    if (user.role == Role.Lawyer) {
      listPayments = await this.paymentModel
        .find({ destination: user._id, paymentStatus: PaymentStatus.FINISHED })
        .populate('source')
        .populate('meetingId');
    } else {
      listPayments = await this.paymentModel
        .find({ source: user._id })
        .populate('destination')
        .populate('meetingId');
    }
    return listPayments;
  }

  async createPayment(user: User, body: CreatePaymentDto) {
    const findByMeetingId = await this.paymentModel.findOne({
      meetingId: body.meetingId,
    });
    if (findByMeetingId) {
      return {
        isSuccess: false,
        message: 'Meeting already paid',
      };
    }
    const newBalance = user.balance - body.amount;

    if (newBalance < 0) {
      return {
        isSuccess: false,
        message: 'Balance is not enough to pay',
      };
    }
    await this.paymentModel.create({
      source: user._id,
      destination: body.destination,
      description: body.description,
      meetingId: body.meetingId,
      amount: body.amount,
    });
    await this.meetingService.updateMeeting({
      meetingId: body.meetingId,
      status: MeetingStatus.PAID,
    });

    const res = await this.userModel.findByIdAndUpdate(user._id.toString(), {
      balance: newBalance,
    });
    return {
      isSuccess: true,
      message: 'Meeting paid successfully',
    };
  }
}
