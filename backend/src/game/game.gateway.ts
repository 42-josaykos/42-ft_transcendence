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
import { Game } from 'src/game/game.class';
import { Connection } from 'src/game/game.class';
import { Player } from 'src/game/game.class';
import { Spectator } from 'src/game/game.class';
import { Ball } from 'src/game/game.class';
import axios from 'axios';
import { GameService } from './game.service';

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
  constructor(private gameService: GameService) {}

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
      const playerOne: Player = { player: this.queue.shift() };
      const playerTwo: Player = { player: this.queue.shift() };
      // console.log('playerOne: ', playerOne);
      // console.log('playerTwo: ', playerTwo);

      // Create and start game
      const players = this.gameService.createGame(
        playerOne,
        playerTwo,
        this.server,
      );
      this.server
        .to(playerOne.player.socketID[0])
        .to(playerTwo.player.socketID[0])
        .emit('startGame', players);
    }
  }

  @SubscribeMessage('endGame')
  async handleEndGame(
    @ConnectedSocket() clientInformation,
    @MessageBody() data: any,
  ) {
    // Determining which game
    const gameIndex = this.games.findIndex(
      (game) =>
        game.players[0].player.user.id === data.user.id ||
        game.players[1].player.user.id === data.user.id,
    );

    // Logic will only run on playerOne
    if (
      gameIndex !== -1 &&
      data.user.id === this.games[gameIndex].players[0].player.user.id
    ) {
      // POST match data in the database through the API
      const body = {
        players: [
          { id: this.games[gameIndex].players[0].player.user.id },
          { id: this.games[gameIndex].players[1].player.user.id },
        ],
        score: [data.score[0], data.score[1]],
      };
      const match = await axios({
        url: 'http://localhost:4000/matches',
        method: 'POST',
        data: body,
      });
      // console.log('Match: ', match.data);

      // Remove match from game array
      this.games.splice(gameIndex, 1);
    }
  }

  @SubscribeMessage('moveLeft')
  handleMoveLeft(@ConnectedSocket() client: Socket, @MessageBody() data: User) {
    // // Determining which game
    // const gameIndex = this.games.findIndex(
    //   (game) =>
    //     game.players[0].player.user.id === data.id ||
    //     game.players[1].player.user.id === data.id,
    // );
    // // console.log('gameIndex left: ', gameIndex);

    // // Should never append, but prevention is better than cure
    // if (gameIndex === -1) {
    //   throw new WsException('Game was not found');
    // }

    try {
      const players = this.gameService.moveLeft(client.id, data);
      this.server.emit('updatePlayerMoved', players);
    } catch (error) {
      throw error;
    }
  }

  @SubscribeMessage('moveRight')
  handleMoveRight(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: User,
  ) {
    // Determining which game
    // const gameIndex = this.games.findIndex(
    //   (game) =>
    //     game.players[0].player.user.id === data.id ||
    //     game.players[1].player.user.id === data.id,
    // );
    // // console.log('gameIndex right: ', gameIndex);

    // // Should never append, but prevention is better than cure
    // if (gameIndex === -1) {
    //   throw new WsException('Game was not found');
    // }

    // // Detect which player moved
    // // Will later need to send ONLY to people watching / playing the game
    // if (data.id === this.games[gameIndex].players[0].player.user.id)
    //   this.server.emit('playerOneMoveRight');
    // else this.server.emit('playerTwoMoveRight');
    try {
      const players = this.gameService.moveRight(client.id, data);
      this.server.emit('updatePlayerMoved', players);
    } catch (error) {
      throw error;
    }
  }

  broadcastEndGame() {
    console.log('YES!');
  }
}
