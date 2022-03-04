import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class CreateMatchDTO {
  @ApiProperty({ required: false })
  readonly id: number;

  @ApiProperty({ required: true })
  readonly playerOne: User;

  @ApiProperty({ required: true })
  readonly playerTwo: User;

  @ApiProperty({ required: true })
  @IsInt()
  readonly scorePlayerOne: number;

  @ApiProperty({ required: true })
  @IsInt()
  readonly scorePlayerTwo: number;

  @ApiProperty({ required: false })
  readonly winner: User;
}
