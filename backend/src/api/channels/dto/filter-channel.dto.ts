import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class FilterChannelDTO {
  // Search parameters
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  public id?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  readonly isPrivate?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  readonly isDirectChannel?: boolean;

  // Fetch field parameters
  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly password?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly messages?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly owner?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly admins?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly members?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly mutes?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly bans?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly invites?: boolean;
}
