import { IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';
import User from 'src/api/users/entities/user.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsDefined()
  readonly author: User;

  @IsNotEmpty()
  @IsDefined()
  readonly channel: Channel;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly data: string;
}
