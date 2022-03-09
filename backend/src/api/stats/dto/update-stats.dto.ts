import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatsDTO {
  @ApiProperty({ required: false })
  readonly played: number;

  @ApiProperty({ required: false })
  readonly win: number;

  @ApiProperty({ required: false })
  readonly lose: number;

  @ApiProperty({ required: false, type: 'decimal' })
  readonly ratio: number;
}
