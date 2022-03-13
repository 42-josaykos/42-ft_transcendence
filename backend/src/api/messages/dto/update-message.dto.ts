import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import Channel from 'src/api/channels/entities/channel.entity';
import User from 'src/api/users/entities/user.entity';

export class UpdateMessageDTO {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  readonly author: User;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  readonly channel: Channel;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  readonly data: string;
}
