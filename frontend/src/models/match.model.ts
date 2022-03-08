import type { User } from './user.model';

export interface Match {
  id: number;
  players: User[];
  winner: User;
  score: number[];
}
