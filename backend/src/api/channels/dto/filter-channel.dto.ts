import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsEmpty,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsBooleanString()
  @IsOptional()
  readonly isPrivate?: boolean;

  @ApiProperty({ required: false })
  @IsBooleanString()
  @IsOptional()
  readonly isProtected?: boolean;

  @ApiProperty({ required: false })
  @IsBooleanString()
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
