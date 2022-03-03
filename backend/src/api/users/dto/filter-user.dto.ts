import { IsNumberString, IsString } from 'class-validator';

export class FilterUserDTO {
  @IsNumberString()
  readonly id: number;

  @IsString()
  readonly username: string;
}
