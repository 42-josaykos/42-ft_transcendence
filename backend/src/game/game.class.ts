import User from 'src/api/users/entities/user.entity';

export class Connection {
  user: User;
  socketID: string[];
}

export class Game {
  players: Player[];
  spectators?: Spectator[];
  ball?: Ball;
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
  paddleSize: number;
  refreshRate: number;
}
