import { ApiProperty } from '@nestjs/swagger';
import Channel from 'src/api/channels/entities/channel.entity';
import Message from '../../messages/entities/message.entity';
import Stats from '../../stats/entities/stats.entity';

export class CreateUserDTO {
  @ApiProperty({ required: true })
  readonly username: string;

  @ApiProperty({ required: false })
  readonly student_id?: string;

  @ApiProperty({ required: false })
  readonly github_id?: string;

  @ApiProperty({ required: false })
  readonly avatar?: string;

  @ApiProperty({ required: false })
  readonly stats?: Stats;

  @ApiProperty({ required: false })
  readonly messages?: Message[];

  @ApiProperty({ required: false })
  readonly channels?: Channel[];
}
