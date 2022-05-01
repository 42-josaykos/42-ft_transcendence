import User from 'src/api/users/entities/user.entity';

export class Connection {
  user: User;
  socketID: string[];
}

export class Game {
  players: Player[];
  spectators?: Spectator[];
  ball?: Ball;
  finished?: boolean;
  winner?: Player;
  // intervalID?: number;
  intervalID?: NodeJS.Timer;
}

export class Player {
  player: Connection;
  x?: number;
  y?: number;
  paddle?: Paddle;
  color?: string;
  score?: number;
}

export class Spectator {
  user: Connection;
}

export class Ball {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  size: number;
  color: string;
}

export class BallBoundaries {
  Xmin: number;
  Xmax: number;
  Ymin: number;
  Ymax: number;
}

export class Paddle {
  h: number;
  w: number;
  speed: number;
}

export class Canvas {
  h: number;
  w: number;
  bound: number;
  refreshRate: number;
}

export class GameOptions {
  paddleSize: number;
  ballSpeed: number;
}
