import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class MuteUserDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDefined()
  readonly user: User;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly time?: string;
}
export default MuteUserDTO;
