import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class UpdateChannelDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly isPrivate?: boolean | false;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password?: string | null;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsNotEmpty()
  @IsOptional()
  readonly owner?: User;

  // Updating with theses will need full User arrays to be send in body
  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly admins?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly members?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly mutes?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly bans?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly invites?: User[];

  // Updating with theses will just need Users you want to add or remove int the arrays
  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly addAdmins?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly removeAdmins?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly addMembers?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly removeMembers?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly addMutes?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly removeMutes?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly addBans?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly removeBans?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly addInvites?: User[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly removeInvites?: User[];
}
