import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameGateway } from 'src/game/game.gateway';
import { Game } from 'src/game/game.class';
import { Connection } from 'src/game/game.class';
import { Player } from 'src/game/game.class';
import { Spectator } from 'src/game/game.class';
import { Ball } from 'src/game/game.class';
import { Paddle } from 'src/game/game.class';
import { Canvas } from 'src/game/game.class';
import User from 'src/api/users/entities/user.entity';

@Injectable()
export class GameService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}
  private gateway: GameGateway;

  private games: Game[] = [];
  private readonly canvas: Canvas = {
    h: 600,
    w: 1000,
    bound: 25,
    paddleSize: 2,
    refreshRate: 1000 / 60,
  };

  onModuleInit() {
    this.gateway = this.moduleRef.get(GameGateway);
  }

  // Main game code
  createGame(playerOne: Player, playerTwo: Player, socket: Server) {
    // Create and start game
    playerOne = this.initNewPlayerOne(playerOne.player);
    playerTwo = this.initNewPlayerTwo(playerTwo.player);
    const newGame: Game = { players: [playerOne, playerTwo], spectators: [] };
    newGame.intervalID = setInterval(this.gameLoop, this.canvas.refreshRate);

    this.games.push(newGame);

    // this.endGame(this.games.indexOf(newGame));
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

  // Player moving handlers
  moveLeft(socketID: string, player: User): Player[] {
    // Determining which game
    const gameIndex = this.games.findIndex(
      (game) =>
        game.players[0].player.user.id === player.id ||
        game.players[1].player.user.id === player.id,
    );
    // console.log('gameIndex left: ', gameIndex);

    // Should never append, but prevention is better than cure
    if (gameIndex === -1) throw new WsException('Game was not found');

    let playerOne = this.games[gameIndex].players[0];
    let playerTwo = this.games[gameIndex].players[1];

    // Detect which player moved
    // Will later need to send ONLY to people watching / playing the game
    if (player.id === playerOne.player.user.id)
      playerOne = this.computePlayerMoveLeft(playerOne);
    else playerTwo = this.computePlayerMoveLeft(playerTwo);

    return [playerOne, playerTwo];
    // this.server.emit('playerOneMoveLeft');
    // else this.server.emit('playerTwoMoveLeft');
  }

  moveRight(socketID: string, player: User): Player[] {
    // Determining which game
    const gameIndex = this.games.findIndex(
      (game) =>
        game.players[0].player.user.id === player.id ||
        game.players[1].player.user.id === player.id,
    );
    // console.log('gameIndex left: ', gameIndex);

    // Should never append, but prevention is better than cure
    if (gameIndex === -1) throw new WsException('Game was not found');

    let playerOne = this.games[gameIndex].players[0];
    let playerTwo = this.games[gameIndex].players[1];

    // Detect which player moved
    // Will later need to send ONLY to people watching / playing the game
    if (player.id === playerOne.player.user.id)
      playerOne = this.computePlayerMoveRight(playerOne);
    else playerTwo = this.computePlayerMoveRight(playerTwo);

    return [playerOne, playerTwo];
    // this.server.emit('playerOneMoveLeft');
    // else this.server.emit('playerTwoMoveLeft');
  }

  computePlayerMoveLeft(player: Player) {
    if (player.y - player.paddle.speed >= 0) {
      player.y -= player.paddle.speed;
    }
    return player;
  }

  computePlayerMoveRight(player: Player) {
    if (player.y + player.paddle.h + player.paddle.speed <= this.canvas.h) {
      player.y += player.paddle.speed;
    }
    return player;
  }

  // Game components initialization
  initNewPaddle(): Paddle {
    const paddleHeight =
      (0.2 + (this.canvas.paddleSize - 1) * 0.05) * this.canvas.h;
    const paddleWidth = 0.2 * 0.2 * this.canvas.h;
    const paddleSpeed = 0.05 * (this.canvas.h / 2 - paddleHeight / 2);

    const newPaddle: Paddle = {
      h: paddleHeight,
      w: paddleWidth,
      speed: paddleSpeed,
    };

    return newPaddle;
  }

  initNewPlayerOne(user: Connection): Player {
    const paddle = this.initNewPaddle();
    const playerX = this.canvas.bound;
    const playerY = this.canvas.h / 2 - paddle.h / 2;

    const playerOne: Player = {
      player: user,
      x: playerX,
      y: playerY,
      paddle: paddle,
      score: 0,
      color: 'blue',
    };

    return playerOne;
  }

  initNewPlayerTwo(user: Connection): Player {
    const paddle = this.initNewPaddle();
    const playerX = this.canvas.w - this.canvas.bound - paddle.w;
    const playerY = this.canvas.h / 2 - paddle.h / 2;

    const playerTwo: Player = {
      player: user,
      x: playerX,
      y: playerY,
      paddle: paddle,
      score: 0,
      color: 'pink',
    };

    return playerTwo;
  }
}
