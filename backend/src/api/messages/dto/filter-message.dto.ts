import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterMessageDTO {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly authorID?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly authorName?: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly channelID?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly channelName?: string;
}
