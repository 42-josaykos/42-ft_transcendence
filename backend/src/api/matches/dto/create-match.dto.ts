import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class CreateMatchDTO {
  @IsArray()
  @IsNotEmpty()
  @IsDefined()
  readonly players: User[];

  @IsArray()
  @IsNotEmpty()
  @IsDefined()
  readonly score: number[];

  @IsOptional()
  @IsNotEmpty()
  readonly winner: User;

  @IsOptional()
  @IsNotEmpty()
  readonly isRankedMatch: boolean;
}
