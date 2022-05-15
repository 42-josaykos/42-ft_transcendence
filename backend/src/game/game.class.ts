import { Connection } from 'src/status/status.class';

export class Game {
  id: number;
  players: Player[];
  // spectators?: Spectator[];
  ball: Ball;
  events: Events;
  finished: boolean;
  winner?: Player;
  intervalID?: NodeJS.Timer;
  socketRoom: string;
}

export class Player {
  player: Connection;
  x?: number;
  y?: number;
  paddle?: Paddle;
  color?: string;
  score?: number;
}

// export class Spectator {
//   user: Connection;
// }

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

export class Events {
  sounds: Sound;
}

export class Sound {
  hit: boolean;
  wall: boolean;
  score: boolean;
  win: boolean;
  loose: boolean;
}

export class Invites {
  user: Connection;
  invitesReceived: Connection[];
}
