import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { NotificationService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway(4001, {
  cors: true,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly notificationService: NotificationService,
    private readonly userService: UsersService,
  ) {}

  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    await this.chatService.getUserFromSocket(socket);
  }
  async handleDisconnect(socket: Socket) {
    // A client has disconnected
    console.log('disconnect', socket.id);
  }
  @SubscribeMessage('notification')
  async listenToNotification(
    @MessageBody() body,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('body', body);
    const user = await this.userService.getById(body.userId);
    const { socketId } = user;
    console.log('socketId', socketId);
    const notification = await this.notificationService.createNotification({
      userId: body.userId,
      content: body.content,
      url: body.url,
    });
    console.log(notification);
    this.server.sockets.to(socketId).emit('notification', notification);
  }

  @SubscribeMessage('message')
  async listenForMessages(
    @MessageBody()
    body: {
      conversationId: string;
      senderId: string;
      content: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket.id);
    console.log(body);

    const conversation: any = await this.chatService.getConversationById(
      body.conversationId,
    );
    const receiverId = conversation.listUserIds.find(
      (item) => item != body.senderId,
    );
    console.log('socket send to receiver id', receiverId);

    const user = await this.userService.getById(receiverId);
    console.log('socket send to socket id', user.socketId);
    this.server.sockets.to(user.socketId).emit('message', body);
  }

  @SubscribeMessage('callUser')
  async listenOnCallUsers(
    @MessageBody()
    body: {
      userToCall: string;
      from: string;
      name: string;
      signalData: any;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.sockets.to(body.userToCall).emit('callUser', {
      signal: body.signalData,
      from: body.from,
      name: body.name,
    });
  }

  @SubscribeMessage('answerCall')
  async listenOnAnswerCall(
    @MessageBody()
    body: {
      signal: any;
      to: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.sockets.to(body.to).emit('callAccepted', body.signal);
  }
}
