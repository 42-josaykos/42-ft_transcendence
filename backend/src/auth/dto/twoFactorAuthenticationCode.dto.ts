import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class twoFactorAuthenticationCodeDTO {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly twoFactorAuthenticationCode: string;
}
