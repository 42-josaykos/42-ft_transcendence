import { ApiProperty } from '@nestjs/swagger';
import Stats from '../../stats/entities/stats.entity';

export class CreateUserDTO {
  readonly id: number;

  @ApiProperty({ required: true })
  readonly username: string;

  // @ApiProperty({ required: false })
  readonly stats: Stats;
}
