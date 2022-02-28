import User from 'src/api/users/entities/user.entity';
import { IsInt, IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsInt()
  readonly id: number;

  readonly author: User;

  @IsString()
  readonly channel: string;

  @IsString()
  readonly data: string;
}
