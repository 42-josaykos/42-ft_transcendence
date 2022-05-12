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
import axios from 'axios';
import User from 'src/api/users/entities/user.entity';
import { Connection } from 'src/status/status.class';
import { GameService } from './game.service';
import { Game, Player } from 'src/game/game.class';

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
  private connectedClients: Connection[] = [];
  private queue: Connection[] = [];

  afterInit(server: any) {
    this.logger.log('Game gateway is initialized');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Connection: ${client.id}`);
    this.server.to(client.id).emit('requestGameUserInfo', '');
  }

  @SubscribeMessage('gameConnection')
  handleNewConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: User,
  ) {
    // Checking if the user already exists
    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.user.id === data.id,
    );

    // If user was not already connected, add the new user, and send the updated list
    if (userIndex === -1)
      this.connectedClients.push({ user: data, socketID: [client.id] });
    // Else, add the new socket to the corresponding Connections object and send client list to new client
    else this.connectedClients[userIndex].socketID.push(client.id);

    // console.log('Clients connected: ', this.connectedClients);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Disconnect: ${client.id}`);
    const userIndex = this.connectedClients.findIndex(
      (connection) => connection.socketID.indexOf(client.id) !== -1,
    );

    // Should never append, but prevention is better than cure
    if (userIndex === -1) {
      // console.log('Client: ', client);
      console.log('Connected Clients: ', this.connectedClients);
      throw new WsException('Disconnecting user was not found');
    }

    // Removing socketID from corresponding user
    this.connectedClients[userIndex].socketID.splice(
      this.connectedClients[userIndex].socketID.indexOf(client.id),
      1,
    );

    // If the user has no more connected sockets, user is offline: removing it and sending updated list
    if (!this.connectedClients[userIndex].socketID.length)
      this.connectedClients.splice(userIndex, 1);

    // console.log('Clients connected: ', this.connectedClients);
  }

  // Queue handling
  @SubscribeMessage('queue')
  async handleQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: User,
  ) {
    // Adding player to queue
    this.queue.push(this.gameService.getUser(this.connectedClients, data));
    // console.log('queue: ', this.queue);

    // Start a game if there is at least 2 players in the queue waiting
    while (this.queue.length >= 2) {
      // Remove players from queue
      const playerOne: Player = { player: this.queue.shift() };
      const playerTwo: Player = { player: this.queue.shift() };
      // console.log('playerOne: ', playerOne);
      // console.log('playerTwo: ', playerTwo);

      // Create and start game
      this.gameService.createGame(
        playerOne,
        playerTwo,
        this.server,
      );

      // Emit live games to clients
      this.server.emit('liveGames', this.getOngoingGames());

      // Create a socket room
      const roomName = `${playerOne.player.user.id}-${playerTwo.player.user.id}`;
      this.joinRoom(roomName, [
        ...playerOne.player.socketID,
        ...playerTwo.player.socketID,
      ]);
      this.server.to(roomName).emit('startGame', [playerOne.player.user, playerTwo.player.user]);
    }
  }

  @SubscribeMessage('leaveQueue')
  leaveQueue(@ConnectedSocket() client: Socket, @MessageBody() data: User) {
    // Removes the user from the queue if they are in it
    const userIndex = this.queue.findIndex(
      (connection) => connection.user.id === data.id,
    );

    if (userIndex !== -1) this.queue.splice(userIndex, 1);
  }

  getOngoingGames() {
    const liveGames = this.gameService.getGames().map((value) => {
      return {
        id: value.id,
        playerOne: value.players[0].player.user,
        playerTwo: value.players[1].player.user,
      };
    });
    // console.log('Live Games: ', liveGames);

    return liveGames;
  }

  // Spectators handling
  @SubscribeMessage('addSpectator')
  addSpectator(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameID: number,
  ) {
    // Add a spectator to a game
    const spectatedGame = this.gameService
      .getGames()
      .find((value) => value.id === gameID);

    // console.log('Spectated game: ', spectatedGame);

    // Add the spectator socket to the game room
    if (spectatedGame) {
      this.server.to(client.id).socketsJoin(spectatedGame.socketRoom);
      this.server.to(client.id).emit('spectateGame');
    }
  }

  // SocketIO room managment
  joinRoom(roomName: string, socketIDs: string[]) {
    for (const socketID of socketIDs)
      this.server.to(socketID).socketsJoin(roomName);
  }

  leaveRoom(roomName: string, socketIDs: string[]) {
    for (const socketID of socketIDs)
      this.server.to(socketID).socketsLeave(roomName);
  }

  emitToSockets(event: string, data: any, socketID: string[]) {
    for (const socket of socketID) {
      this.server.to(socket).emit(event, data);
    }
  }

  sendGameUpdate(game: Game) {
    const gameUpdate = {
      playerOne: {
        x: game.players[0].x,
        y: game.players[0].y,
        score: game.players[0].score,
      },
      playerTwo: {
        x: game.players[1].x,
        y: game.players[1].y,
        score: game.players[1].score,
      },
      ball: { x: game.ball.x, y: game.ball.y, size: game.ball.size },
      events: game.events,
    };

    // console.log('gameUpdate: ', gameUpdate);
    this.server.to(game.socketRoom).emit('gameUpdate', gameUpdate);
  }

  async broadcastEndGame(game: Game) {
    try {
      // POST match data in the database through the API
      const body = {
        players: [
          { id: game.players[0].player.user.id },
          { id: game.players[1].player.user.id },
        ],
        score: [game.players[0].score, game.players[1].score],
      };
      const match = await axios({
        url: 'http://localhost:4000/matches',
        method: 'POST',
        data: body,
      });
      // console.log('Match Result: ', match.data);

      this.server.to(game.socketRoom).emit('endGame');
      this.server.emit('liveGames', this.getOngoingGames());

      // Make the players / spectators leave the room
      this.server.to(game.socketRoom).socketsLeave(game.socketRoom);
    } catch (error) {
      throw error;
    }
  }

  // Player Handling
  @SubscribeMessage('moveLeft')
  handleMoveLeft(@ConnectedSocket() client: Socket, @MessageBody() data: User) {
    try {
      const players = this.gameService.moveLeft(client.id, data);
    } catch (error) {
      throw error;
    }
  }

  @SubscribeMessage('moveRight')
  handleMoveRight(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: User,
  ) {
    try {
      const players = this.gameService.moveRight(client.id, data);
    } catch (error) {
      throw error;
    }
  }
}
