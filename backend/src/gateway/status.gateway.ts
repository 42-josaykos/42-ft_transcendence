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
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import User from 'src/api/users/entities/user.entity';

class Connections {
  userID: number;
  socketID: string[];
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
  },
})
export class StatusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients: Connections[] = new Array();

  // Init, connection, disconnect event handlers
  afterInit(server: any) {
    this.connectedClients = new Array();
    console.log('StatusSystem gateway is initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    // console.log(`Connection: ${client.id}`);
    this.server.to(client.id).emit('requestUserInfo', '');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // console.log(`Disconnect: ${client.id}`);
    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.socketID.indexOf(client.id) !== -1,
    );

    // Should never append, but prevention is better than cure
    if (userIndex === -1)
      throw new WsException('Disconnecting user was not found');

    // Removing socketID from corresponding user
    this.connectedClients[userIndex].socketID.splice(
      this.connectedClients[userIndex].socketID.indexOf(client.id),
      1,
    );

    // If the user has no more connected sockets, user is offline: removing it and sending updated list
    if (!this.connectedClients[userIndex].socketID.length) {
      this.connectedClients.splice(userIndex, 1);
      // console.log('Clients connected: ', this.connectedClients);
      return {
        event: 'update',
        data: this.connectedClients.map(({ userID, ...rest }) => userID),
      };
    }
    // console.log('Clients connected: ', this.connectedClients);
  }

  @SubscribeMessage('connection')
  handleNewConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: User,
  ): WsResponse<number[]> {
    // Checking if the user already exists
    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.userID === data.id,
    );

    // If user was not already connected, add the new user, and send the updated list
    if (userIndex === -1) {
      this.connectedClients.push({ userID: data.id, socketID: [client.id] });
      // console.log('Clients connected: ', this.connectedClients);
      return {
        event: 'update',
        data: this.connectedClients.map(({ userID, ...rest }) => userID),
      };
    }
    // Else, add the new socket to the corresponding Connections object
    else {
      this.connectedClients[userIndex].socketID.push(client.id);
    }
    // console.log('Clients connected: ', this.connectedClients);
  }
}
