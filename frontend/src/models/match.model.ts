import type { User } from './user.model';

export interface Match {
  id: number;
  playerOne: User;
  playerTwo: User;
  winner: User;
  score: number[];
}
