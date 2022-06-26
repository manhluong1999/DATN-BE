import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async saveMessage(content: string, sender: User) {
    const newMessage = new this.messageModel({
      content,
      sender,
    });
    return newMessage.save();
  }

  async getAllMessages(receiveId) {
    return this.messageModel.find({
      receiveId,
    });
  }
  async getUserFromSocket(socket: Socket) {
    const authToken: any = socket.handshake?.query?.token;
    console.log(authToken);
    const user =
      await this.authenticationService.getUserFromAuthenticationToken(
        authToken,
      );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
