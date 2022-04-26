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
  user: User;
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
  private queue: Connection[];

  afterInit(server: any) {
    this.games = new Array();
    this.queue = new Array();
    this.logger.log('Game gateway is initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Connection: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Disconnect: ${client.id}`);
  }

  @SubscribeMessage('queue')
  handleQueue(@ConnectedSocket() client, @MessageBody() data: User) {
    // Adding player to queue
    this.queue.push({ user: data, socketID: [client.id] });

    // Start a game if there is at least 2 players in the queue waiting
    while (this.queue.length >= 2) {
      // Remove players from queue
      const playerOne = this.queue.shift();
      const playerTwo = this.queue.shift();

      // Start game
      this.server
        .to(playerOne.socketID[0])
        .to(playerTwo.socketID[0])
        .emit('startGame', { playerOne: playerOne, playerTwo: playerTwo });
    }
  }

  @SubscribeMessage('moveLeft')
  handleMoveLeft(@ConnectedSocket() client: Socket, @MessageBody() data: User) {
    // const gameIndex = this.games.findIndex((game) =>
    //   game.players.findIndex((connection) => connection.userID === data.id),
    // );

    // Should never append, but prevention is better than cure
    // if (gameIndex === -1) {
    //   throw new WsException('Game was not found');
    // }

    // Detect which player moved
    // Will later need to send ONLY to people watching / playing the game
    // if (data.id === this.games[gameIndex].players[0].userID)
    // console.log('verif: ', client.data.test);
    if (data.id === 1) this.server.emit('playerOneMoveLeft');
    else this.server.emit('playerTwoMoveLeft');
    // else this.server.emit('playerTwoMoveLeft');
  }

  @SubscribeMessage('moveRight')
  handleMoveRight(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: User,
  ) {
    // const gameIndex = this.games.findIndex((game) =>
    //   game.players.findIndex((connection) => connection.userID === data.id),
    // );

    // Should never append, but prevention is better than cure
    // if (gameIndex === -1) {
    //   throw new WsException('Game was not found');
    // }

    // Detect which player moved
    // Will later need to send ONLY to people watching / playing the game
    // if (data.id === this.games[gameIndex].players[0].userID)
    if (data.id === 1) this.server.emit('playerOneMoveRight');
    else this.server.emit('playerTwoMoveRight');
    // else this.server.emit('playerTwoMoveRight');
  }
}
