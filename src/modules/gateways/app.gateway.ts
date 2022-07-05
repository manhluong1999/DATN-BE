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

@WebSocketGateway(4001, {
  cors: true,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  constructor(private readonly chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    await this.chatService.getUserFromSocket(socket);
  }
  async handleDisconnect(socket: Socket) {
    // A client has disconnected
    console.log('disconnect', socket.id);
  }
  @SubscribeMessage('send-message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const sender = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(content, sender);
    this.server.sockets.emit('receive_message', {
      content,
      sender,
    });

    this.server.sockets.emit('receive_message', message);
  }
}
