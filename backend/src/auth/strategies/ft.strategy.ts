import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from '../auth.interface';
import { CreateUserDTO } from 'src/api/users/dto/create-user.dto';

// Invoke the 42 API Authentication Service
@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super({
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: process.env.FT_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id: studentID, username, photos } = profile;
    const { value: avatar } = photos[0];

    const details: CreateUserDTO = { username, studentID, avatar };

    return await this.authService.validateUser(details);
  }
}
