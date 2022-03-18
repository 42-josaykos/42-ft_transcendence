import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterUserDTO {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly username?: string;
}
