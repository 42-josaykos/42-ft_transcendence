import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
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

  private connectedClients: number[];

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Connection: ${client.id}`);
    this.server.emit('sendNewConnection', '');
    // return { event: 'sendNewConnection', data: '' };
    // console.log(`Check socket content: `, client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Disconnect: ${client.id}`);
  }

  @SubscribeMessage('addClientConnection')
  handleNewConnection(@MessageBody() data: string) {
    console.log(`Verif content: ${data}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): WsResponse<string> {
    console.log('Payload: ', data);
    // this.server.emit('message', 'Hello World!');
    return { event: 'message', data: 'Hello You!' };
  }
}
