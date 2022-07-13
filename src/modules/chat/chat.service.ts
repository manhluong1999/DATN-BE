import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';

@Injectable()
export class ChatService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async getConversationById(conversationId: string) {
    return await this.conversationModel.findById(conversationId);
  }
  async getOneConversation(toUser: string, userId: string) {
    const findConversation = await this.conversationModel.findOne({
      $or: [
        {
          listUserIds: [toUser, userId],
        },
        {
          listUserIds: [userId, toUser],
        },
      ],
    });
    if (!findConversation) {
      const newConversation = new this.conversationModel({
        name: 'conversation 1',
        listUserIds: [userId, toUser],
      });
      return newConversation.save();
    }
    const listMessages = await this.messageModel.find({
      conversationId: findConversation.id,
    });
    return {
      listMessages,
      conversationId: findConversation.id,
      receiverId: toUser,
    };
  }
  async getListConversationByUserId(userId: string) {
    const listConversation = await this.conversationModel.find({
      listUserIds: userId,
    });
    return listConversation.map((conversation) => {
      return {
        conversationId: conversation.id,
        receiverId: conversation.listUserIds.find((item) => item != userId),
      };
    });
  }
  async saveMessage(body: {
    conversationId: string;
    senderId: string;
    content: string;
  }) {
    const newMessage = new this.messageModel(body);
    return newMessage.save();
  }

  async getAllMessages(conversationId) {
    return this.messageModel.find({
      conversationId,
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
      return null;
      // throw new WsException('Invalid credentials.');
    }
    await this.authenticationService.saveSocketId(socket.id, user.id);
    return user;
  }
}
