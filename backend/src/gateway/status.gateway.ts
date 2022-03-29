import { Server } from 'socket.io';
import {
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
export class StatusGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connection')
  handleConection(client: any, payload: any) {
    console.log('Payload: ', payload);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log('Payload: ', payload);
    this.server.sockets.emit('message', 'Hello World!');
  }
}
