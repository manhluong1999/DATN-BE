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
import { ChatService } from './chat.service';
import ChatDto from './dto/chat.dto';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Get('list-conversation')
  async getListConversationUser(@Req() request: RequestWithUser) {
    return await this.chatService.getListConversationByUserId(
      request.user._id.toString(),
    );
  }

  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Get('get-conversation')
  async getConversationUser(
    @Req() request: RequestWithUser,
    @Query('userId') userId: string,
  ) {
    return await this.chatService.getOneConversation(
      userId,
      request.user._id.toString(),
    );
  }

  @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  @ApiBearerAuth('JWT')
  @Post('create-message')
  async createMessage(@Req() request: RequestWithUser, @Body() body: ChatDto) {
    return await this.chatService.saveMessage({
      ...body,
      senderId: request.user._id.toString(),
    });
  }
  //   @UseGuards(RoleGuard([Role.User, Role.Lawyer]))
  //   @ApiBearerAuth('JWT')
  //   @Get('list-message')
  //   async getListMessage(@Query('conversationId') conversationId: string) {
  //     return await this.chatService.getAllMessages(conversationId);
  //   }
}
