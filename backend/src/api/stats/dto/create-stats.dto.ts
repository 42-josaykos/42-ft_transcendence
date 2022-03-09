import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Double } from 'typeorm';
import User from '../../users/entities/user.entity';

export class CreateStatsDTO {
  @ApiProperty({ required: false })
  readonly id: number;

  @ApiProperty({ required: true })
  readonly user: User;

  @ApiProperty({ required: true })
  @IsInt()
  readonly played: number = 0;

  @ApiProperty({ required: true })
  @IsInt()
  readonly win: number = 0;

  @ApiProperty({ required: true })
  @IsInt()
  readonly lose: number = 0;

  @ApiProperty({ required: true, type: 'decimal' })
  readonly ratio: number = 0.0;
}
