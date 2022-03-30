import { Server } from 'socket.io';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
  },
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connection')
  handleConnection(@MessageBody() data: string) {
    console.log('Connection: ');
  }

  @SubscribeMessage('deconnection')
  handleDisconnect(@MessageBody() data: string) {
    console.log('Deconnection: ');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    console.log('Payload: ', data);
    this.server.sockets.emit('message', 'Hello World!');
  }
}
