import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from '../auth';

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
      scope: 'public',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, username, name, photos } = profile;
    console.log(profile);
    console.log(id, username, name.givenName, photos[0].value);
  }
}
