import User from '../../users/entities/user.entity';

export class CreateStatsDTO {
  readonly user: User;
  readonly played: number = 0;
  readonly win: number = 0;
  readonly lose: number = 0;
  readonly ratio: number = 0.0;
  // readonly history: number[];
}
