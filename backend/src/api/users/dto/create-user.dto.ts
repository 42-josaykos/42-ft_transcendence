import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly username: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly student_id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly github_id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly avatar?: string;
}
