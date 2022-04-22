import { Logger } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import User from 'src/api/users/entities/user.entity';

class Connection {
  userID: number;
  socketID: string[];
}

class Game {
  players: Connection[];
  spectators: Connection[];
}

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: `http://localhost:3001`,
    credentials: true,
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('GameGateway');
  private games: Game[];

  afterInit(server: any) {
    this.games = new Array();
    this.logger.log('Game gateway is initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Connection: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Disconnect: ${client.id}`);
  }

  @SubscribeMessage('moveLeft')
  handleMoveLeft(@ConnectedSocket() client: Socket, @MessageBody() data: User) {
    const gameIndex = this.games.findIndex((game) =>
      game.players.findIndex((connection) => connection.userID === data.id),
    );

    // Should never append, but prevention is better than cure
    // if (gameIndex === -1) {
    //   throw new WsException('Game was not found');
    // }

    // console.log('MoveLeft');
    this.server.emit('moveLeft', '');
  }

  @SubscribeMessage('moveRight')
  handleMoveRight(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: User,
  ) {
    const gameIndex = this.games.findIndex((game) =>
      game.players.findIndex((connection) => connection.userID === data.id),
    );

    // Should never append, but prevention is better than cure
    // if (gameIndex === -1) {
    //   throw new WsException('Game was not found');
    // }

    // console.log('MoveRight');
    this.server.emit('moveRight', '');
  }
}