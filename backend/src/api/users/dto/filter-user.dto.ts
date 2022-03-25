import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterUserDTO {
  // Search parameters
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly username?: string;

  // Show field parameters
  @ApiProperty({ required: false })
  @IsOptional()
  readonly password?: void;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly studentID?: void;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly githubID?: void;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly socketID?: void;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly avatar?: void;
}
