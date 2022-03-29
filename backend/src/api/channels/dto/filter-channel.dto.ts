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

  // Fetch field parameters
  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly password?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly messages?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly owner?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly admins?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly members?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly mutes?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly bans?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly invites?: void;
}
