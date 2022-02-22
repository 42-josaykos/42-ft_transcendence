import User from '../entities/user.entity';

export class CreateStatsDTO {
  readonly user: User;
  readonly played: number;
  readonly win: number;
  readonly lose: number;
  readonly history: number[];
}
