import { IsNumber, IsNumberString, IsString } from 'class-validator';

export class FilterMessageDTO {
  @IsNumberString()
  readonly authorID: number;

  @IsString()
  readonly author: string;

  @IsString()
  readonly channel: string;
}
