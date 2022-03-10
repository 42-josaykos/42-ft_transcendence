import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly student_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly github_id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly avatar?: string;
}
