import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import CreateNotificationDto from './dto/createNotification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(body: CreateNotificationDto) {
    const newConversation = new this.notificationModel({
      ...body,
      createdAt: new Date(),
    });
    await newConversation.populate('userId');
    return newConversation.save();
  }

  async getListNotificationByUserId(userId: string) {
    return await this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId');
  }
}
