import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import User from 'src/api/users/entities/user.entity';

export class UpdateMatchDTO {
  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly players?: User[];

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  readonly playerOne?: User;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  readonly playerTwo?: User;

  @ApiProperty({ required: false })
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  readonly score?: number[];

  @ApiProperty({ required: false })
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  readonly scorePlayerOne?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  readonly scorePlayerTwo?: number;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  readonly winner?: User;
}
