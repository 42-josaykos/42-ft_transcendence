import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    // credentials: true,
  },
})
export class StatusGateway {
  @SubscribeMessage('connection')
  handleConection(client: any, payload: any): string {
    console.log('Payload: ', payload);
    return 'Connection!';
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Payload: ', payload);
    return 'Hello world!';
  }
}
