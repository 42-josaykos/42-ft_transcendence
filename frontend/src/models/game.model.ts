import type { User } from "./user.model";

export interface Player {
  player: Connection;
  x?: number;
  y?: number;
  paddle?: Paddle;
  color?: string;
  score?: number;
}

export interface Connection {
  user: User;
  socketID: string[];
}
