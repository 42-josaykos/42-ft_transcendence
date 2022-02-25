import { ApiProperty } from '@nestjs/swagger';
import Message from '../../messages/entities/message.entity';
import Stats from '../../stats/entities/stats.entity';

export class CreateUserDTO {
  readonly id: number;

  @ApiProperty({ required: true })
  readonly username: string;

  // @ApiProperty({ required: false })
  readonly stats: Stats;

  @ApiProperty({ required: false })
  readonly messages: Message[];
}
