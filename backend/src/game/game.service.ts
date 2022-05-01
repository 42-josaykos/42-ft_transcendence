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
import { BallBoundaries } from 'src/game/game.class';
import { Paddle } from 'src/game/game.class';
import { Canvas } from 'src/game/game.class';
import { GameOptions } from 'src/game/game.class';
import User from 'src/api/users/entities/user.entity';

@Injectable()
export class GameService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}
  private gateway: GameGateway;

  private games: Game[] = [];
  private options: GameOptions = { paddleSize: 2, ballSpeed: 3 };
  private readonly canvas: Canvas = {
    h: 600,
    w: 1000,
    bound: 25,
    refreshRate: 1000 / 30,
  };

  onModuleInit() {
    this.gateway = this.moduleRef.get(GameGateway);
  }

  // Main game code
  createGame(playerOne: Player, playerTwo: Player, socket: Server) {
    // Create and start game
    playerOne = this.initNewPlayerOne(playerOne.player);
    playerTwo = this.initNewPlayerTwo(playerTwo.player);
    const newBall = this.initNewBall();

    let game: Game = {
      players: [playerOne, playerTwo],
      spectators: [],
      ball: newBall,
      finished: false,
      winner: null,
    };

    this.games.push(game);

    // no more intervalID !!
    setInterval(() => {
      // //	Checks whether the ball passed throught the canvas boundaries by the left or by the right (the extra 50 pixels
      // //	make the rendering smoother).
      // console.log(game);

      const gameIndex = this.games.indexOf(game);
      // console.log('gameIndex LOOP: ', gameIndex);
      game = this.games[gameIndex];

      // console.log('Ball x: ', game.ball.x);
      // console.log('Ball y: ', game.ball.y);
      // console.log('P1 x: ', game.players[0].x);
      // console.log('P1 y: ', game.players[0].y);
      // console.log('P2 x: ', game.players[1].x);
      // console.log('P2 y: ', game.players[1].y);

      game.ball.x += game.ball.velocityX;
      game.ball.y += game.ball.velocityY;
      const ballBoundaries = this.getBallBoundaries(game.ball);
      if (
        ballBoundaries.Xmin - 50 > this.canvas.w ||
        ballBoundaries.Xmax + 50 < 0
      ) {
        game = this.updateScore(game);
        if (game.winner) {
          console.log('WINNERRR !!!');
          this.endGame(game);
        }
      }
      // Checks if the ball passed has hit one of the canvas boundaries by the top or by the bottom. If so, it bounces.
      if (ballBoundaries.Ymax >= this.canvas.h || ballBoundaries.Ymin <= 0) {
        game.ball.velocityY *= -1;
        // this.sounds.wall.play();
      }

      // //	Checks in which part of the canvas the ball is in order to send the appropriate player to collision() that'll
      // //	return true if such event occurs.
      const player =
        game.ball.x + game.ball.size < this.canvas.w / 2
          ? game.players[0]
          : game.players[1];
      if (this.computeCollision(game.ball, player)) {
        // this.sounds.hit.play();
        // console.log('Collision!!!');
        game.ball = this.computeNewVelocity(game.ball, player);
      }

      this.gateway.sendGameUpdate(game);
      // return;
    }, this.canvas.refreshRate);
  }

  updateScore(game: Game) {
    //  Checks whether the ball passed throught the canvas boundaries by the left or by the right (the extra 10 pixels
    //  make it visually smoother: the ball has time to cross before it is sent to its default position) and given the
    //  the score is updated.
    const ballBoundaries = this.getBallBoundaries(game.ball);
    if (ballBoundaries.Xmin - 10 > this.canvas.w) ++game.players[0].score;
    else if (ballBoundaries.Xmax + 10 < 0) ++game.players[1].score;

    //  Ends game if one of the two players reached 10.
    if (game.players[0].score == 10 || game.players[1].score == 10) {
      game.finished = true;
      game.winner =
        game.players[0].score == 10 ? game.players[0] : game.players[1];
      // this.gameplay = false;
      // this.endgame = true;
      // this.sounds.win.play();
      return game;
    }
    //  Else, the new score is rendered and the ball is sent at its default position for a new round.
    // this.sounds.score.play();
    // this.resetPlay();
    game.ball = this.initNewBall(-1);
    return game;
  }

  endGame(game: Game) {
    console.log('endGame');
    // const game = this.games[0];
    // const playerOne = game.players[0];
    // const playerTwo = game.players[1];
    // const spectators = game.spectators;

    const gameIndex = this.games.indexOf(game);
    this.games.splice(gameIndex, 1);
    this.gateway.broadcastEndGame(game);
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
    // console.log('gameIndex right: ', gameIndex);

    // Should never append, but prevention is better than cure
    if (gameIndex === -1) throw new WsException('Game was not found');

    let playerOne = this.games[gameIndex].players[0];
    let playerTwo = this.games[gameIndex].players[1];

    // Detect which player moved
    // Will later need to send ONLY to people watching / playing the game
    // console.log('PlayerOne RIGHT BEFORE: ', this.games[gameIndex].players[0]);
    // console.log('PlayerTwo RIGHT BEFORE: ', this.games[gameIndex].players[1]);
    if (player.id === playerOne.player.user.id)
      playerOne = this.computePlayerMoveRight(playerOne);
    else playerTwo = this.computePlayerMoveRight(playerTwo);
    // console.log(
    //   'PlayerOne ALIAS RIGHT AFTER: ',
    //   this.games[gameIndex].players[0],
    // );
    // console.log(
    //   'PlayerTwo ALIAS RIGHT AFTER: ',
    //   this.games[gameIndex].players[1],
    // );
    // console.log('PlayerOne RIGHT AFTER: ', this.games[gameIndex].players[0]);
    // console.log('PlayerTwo RIGHT AFTER: ', this.games[gameIndex].players[1]);

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

  computeCollision(ball: Ball, player: Player) {
    //	Defines the values of the paddle sides' positions and then the ball sides's position given their respective
    //	position: Xmin = left side, Xmax = right side, Ymin = top, Ymax = bottom
    const playerXmin = player.x;
    const playerXmax = player.x + player.paddle.w;
    const playerYmin = player.y;
    const playerYmax = player.y + player.paddle.h;
    const ballBoundaries = this.getBallBoundaries(ball);

    //	Returns 1 or 0 given if there is a collision or not.
    return (
      playerXmin < ballBoundaries.Xmax &&
      playerYmin < ballBoundaries.Ymax &&
      playerXmax > ballBoundaries.Xmin &&
      playerYmax > ballBoundaries.Ymin
    );
  }

  computeNewVelocity(ball: Ball, player: Player) {
    let middleY = player.y + player.paddle.h / 2; //	Y value of the middle of the paddle
    let collisionPoint = ball.y - middleY; //	Computes where the ball hits the paddle
    collisionPoint /= player.paddle.h / 2; //	Normalizing the number : to have something between -1 and 1

    let angleRad = (Math.PI / 4) * collisionPoint; // PI/4 = 45° is arbitrary, I could have chose another angle!
    let direction = ball.x + ball.size < this.canvas.w / 2 ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    return ball;
  }

  getBallBoundaries(ball: Ball) {
    const ballXmin = ball.x - ball.size;
    const ballXmax = ball.x + ball.size;
    const ballYmin = ball.y - ball.size;
    const ballYmax = ball.y + ball.size;

    const ballBoundaries: BallBoundaries = {
      Xmin: ballXmin,
      Xmax: ballXmax,
      Ymin: ballYmin,
      Ymax: ballYmax,
    };

    return ballBoundaries;
  }

  // Game components initialization
  initNewPaddle(): Paddle {
    const paddleHeight =
      (0.2 + (this.options.paddleSize - 1) * 0.05) * this.canvas.h;
    const paddleWidth = 0.2 * 0.2 * this.canvas.h;
    const paddleSpeed = 0.05 * (this.canvas.h / 2 - paddleHeight / 2);

    const newPaddle: Paddle = {
      h: paddleHeight,
      w: paddleWidth,
      speed: paddleSpeed,
    };

    return newPaddle;
  }

  initNewBall(direction: number = 1): Ball {
    const paddle = this.initNewPaddle();
    const ballX = this.canvas.w / 2;
    const ballY = this.canvas.h / 2;
    const ballSize = paddle.w / 2;
    const ballSpeed = 5 * (1 + (this.options.ballSpeed * 2) / 10);
    const ballVelocityX = direction * ballSpeed;
    const ballVelocityY = direction * ballSpeed;

    const newBall: Ball = {
      x: ballX,
      y: ballY,
      velocityX: ballVelocityX,
      velocityY: ballVelocityY,
      speed: ballSpeed,
      size: ballSize,
      color: 'yellow',
    };

    return newBall;
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
