import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateStatsDTO {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  readonly played: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  readonly win: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  readonly lose: number;

  @ApiProperty({ required: false, type: 'decimal' })
  @IsDecimal()
  @IsOptional()
  readonly ratio: number;
}
