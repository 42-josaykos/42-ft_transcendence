import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateStatsDTO {
  @ApiProperty({ required: false })
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  readonly played: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  readonly win: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  readonly lose: number;

  @ApiProperty({ required: false, type: 'decimal' })
  @IsDecimal()
  @IsNotEmpty()
  @IsOptional()
  readonly ratio: number;
}
