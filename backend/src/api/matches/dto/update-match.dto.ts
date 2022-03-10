import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class UpdateMatchDTO {
  @IsArray()
  @IsOptional()
  readonly players: User[];

  // @ApiProperty({ required: false })
  // readonly playerOne: User;

  // @ApiProperty({ required: false })
  // readonly playerTwo: User;

  @IsArray()
  @IsOptional()
  readonly score: number[];

  // @ApiProperty({ required: false })
  // @IsInt()
  // readonly scorePlayerOne: number;

  // @ApiProperty({ required: false })
  // @IsInt()
  // readonly scorePlayerTwo: number;

  @IsOptional()
  readonly winner: User;
}
