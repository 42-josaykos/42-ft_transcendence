import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterMatchDTO {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  readonly playerOneID?: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  readonly playerTwoID?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly playerOneName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly playerTwoName?: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  readonly playerOneScore?: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  readonly playerTwoScore?: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  readonly winnerID?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly winnerName?: string;
}
