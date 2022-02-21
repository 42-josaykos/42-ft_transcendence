import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  readonly id: number;

  @ApiProperty({ required: true })
  readonly username: string;
}
