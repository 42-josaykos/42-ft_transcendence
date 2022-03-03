import { ApiProperty } from '@nestjs/swagger';
import User from 'src/api/users/entities/user.entity';

export class CreateMatchDTO {
  @ApiProperty({ required: false })
  readonly id: number;

  @ApiProperty({ required: true })
  readonly playerOne: User;

  @ApiProperty({ required: true })
  readonly playerTwo: User;

  @ApiProperty({ required: true })
  readonly winner: User;

  @ApiProperty({ required: true })
  readonly score: number[];
}
