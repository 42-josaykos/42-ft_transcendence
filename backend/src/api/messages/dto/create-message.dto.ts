import { IsInt, IsString } from 'class-validator';
import User from 'src/api/users/entities/user.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDTO {
  @ApiProperty({ required: false })
  @IsInt()
  readonly id: number;

  @ApiProperty({ required: true })
  readonly author: User;

  @ApiProperty({ required: true })
  readonly channel: Channel;

  @ApiProperty({ required: true })
  @IsString()
  readonly data: string;
}
