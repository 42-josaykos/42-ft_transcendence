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
  readonly id?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username?: string;

  // Fetch field parameters
  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly password?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly studentID?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly githubID?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly socketID?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly stats?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly avatar?: void;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmpty()
  readonly friends?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly friendsInverse?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly playedMatches?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly winMatches?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly messages?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly ownerChannels?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly adminChannels?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly memberChannels?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly muteChannels?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly banChannels?: void;

  @ApiProperty({ required: false })
  @IsEmpty()
  @IsOptional()
  readonly inviteChannels?: void;
}
