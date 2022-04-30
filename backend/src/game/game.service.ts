import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameGateway } from 'src/game/game.gateway';
import { Game } from 'src/game/game.class';
import { Connection } from 'src/game/game.class';
import { Player } from 'src/game/game.class';
import { Spectator } from 'src/game/game.class';
import { Ball } from 'src/game/game.class';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class GameService implements OnModuleInit {
  private gateway: GameGateway;
  constructor(private moduleRef: ModuleRef) {}

  private readonly refreshRate: number = 60;
  private games: Game[] = [];

  onModuleInit() {
    this.gateway = this.moduleRef.get(GameGateway);
  }

  createGame(playerOne: Player, playerTwo: Player, socket: Server) {
    // Create and start game
    const newGame: Game = { players: [playerOne, playerTwo], spectators: [] };
    newGame.intervalID = setInterval(this.gameLoop, 1000 / this.refreshRate);

    this.games.push(newGame);
    this.endGame(this.games.indexOf(newGame));
  }

  gameLoop() {}

  endGame(gameIndex: number) {
    console.log('endGame');
    const game = this.games[0];
    const playerOne = game.players[0];
    const playerTwo = game.players[1];
    const spectators = game.spectators;

    this.games.splice(gameIndex, 1);
    this.gateway.broadcastEndGame();
  }
}
