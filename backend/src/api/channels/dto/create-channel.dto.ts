import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class CreateChannelDTO {
  @ApiProperty({ required: false })
  @IsInt()
  readonly id: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ nullable: true, required: false })
  readonly isPrivate: boolean | false;

  @ApiProperty({ nullable: true, required: true })
  @IsString()
  readonly password: string | null;

  @ApiProperty({ required: true })
  readonly owner: User;

  @ApiProperty({ required: false })
  readonly admins: User[];

  @ApiProperty({ required: true })
  readonly members: User[];

  @ApiProperty({ required: false })
  readonly mutes: User[];

  @ApiProperty({ required: false })
  readonly bans: User[];
}
