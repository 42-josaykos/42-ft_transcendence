import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class CreateChannelDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly name: string;

  @IsBoolean()
  readonly isPrivate: boolean | false;

  @IsString()
  readonly password: string | null;

  @IsNotEmpty()
  @IsDefined()
  readonly owner: User;

  @IsArray()
  @IsOptional()
  readonly admins: User[];

  @IsArray()
  @IsNotEmpty()
  @IsDefined()
  readonly members: User[];

  @IsArray()
  @IsOptional()
  readonly mutes: User[];

  @IsArray()
  @IsOptional()
  readonly bans: User[];
}
