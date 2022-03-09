import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class CreateMatchDTO {
  @ApiProperty({ required: false })
  readonly id: number;

  @ApiProperty({ required: true, isArray: true })
  readonly players: User[];

  @ApiProperty({ required: true, isArray: true })
  readonly score: number[];

  @ApiProperty({ required: false })
  readonly winner: User;
}
