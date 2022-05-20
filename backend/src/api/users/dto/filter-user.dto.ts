import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmpty,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterUserDTO {
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
  readonly username?: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  readonly studID?: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  readonly gitID?: string;

  // Fetch field parameters
  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly password?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly studentID?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly githubID?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly socketID?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly stats?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  readonly friends?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly friendsInverse?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  readonly blockedUsers?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly blockedUsersInverse?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly playedMatches?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly winMatches?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly messages?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly ownerChannels?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly adminChannels?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly memberChannels?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly muteChannels?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly banChannels?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly inviteChannels?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly refreshToken?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly twoFactorAuthenticationSecret?: boolean;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly isTwoFactorAuthenticationEnabled?: boolean;
}
