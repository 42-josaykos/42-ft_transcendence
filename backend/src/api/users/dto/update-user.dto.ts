import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly avatar?: string;

  @ApiProperty({ required: false, maxLength: 20 })
  @IsString()
  @IsOptional()
  @MinLength(20)
  @MaxLength(20)
  readonly socketID?: string | null;
}
