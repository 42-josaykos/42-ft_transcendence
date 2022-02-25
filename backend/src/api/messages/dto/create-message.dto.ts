import User from 'src/api/users/entities/user.entity';

export class CreateMessageDTO {
  readonly id: number;
  readonly author: User;
  readonly channel: string;
  readonly data: string;
}
