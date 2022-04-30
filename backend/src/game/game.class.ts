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
  score?: number;
}

export class Spectator {
  user: Connection;
}

export class Ball {
  x: number;
  y: number;
}
