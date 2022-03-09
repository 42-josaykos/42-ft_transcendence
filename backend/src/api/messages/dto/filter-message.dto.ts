import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class FilterMessageDTO {
  @ApiProperty({ required: false })
  @IsNumberString()
  readonly authorID: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly authorName: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly channelID: string;
}
