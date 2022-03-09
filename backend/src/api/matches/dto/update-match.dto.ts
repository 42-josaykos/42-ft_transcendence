import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class UpdateMatchDTO {
  @ApiProperty({ required: false, isArray: true })
  readonly players: User[];

  // @ApiProperty({ required: false })
  // readonly playerOne: User;

  // @ApiProperty({ required: false })
  // readonly playerTwo: User;

  @ApiProperty({ required: false, isArray: true })
  // @IsInt()
  readonly score: number[];

  // @ApiProperty({ required: false })
  // @IsInt()
  // readonly scorePlayerOne: number;

  // @ApiProperty({ required: false })
  // @IsInt()
  // readonly scorePlayerTwo: number;

  @ApiProperty({ required: false })
  readonly winner: User;
}
