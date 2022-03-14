import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsDefined, IsInt, IsNotEmpty } from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class CreateStatsDTO {
  @IsNotEmpty()
  @IsDefined()
  readonly user: User;

  @IsInt()
  @IsNotEmpty()
  @IsDefined()
  readonly played: number = 0;

  @IsInt()
  @IsNotEmpty()
  @IsDefined()
  readonly win: number = 0;

  @IsInt()
  @IsNotEmpty()
  @IsDefined()
  readonly lose: number = 0;

  @ApiProperty({ type: 'decimal' })
  @IsDecimal()
  @IsNotEmpty()
  @IsDefined()
  readonly ratio: number = 0.0;
}
