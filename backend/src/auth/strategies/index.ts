import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from '../auth.interface';

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
    const { id: student_id, username, photos } = profile;
    const { value: avatar } = photos[0];

    /////////////////////////////////////// DEBUG
    console.log(profile);
    console.log('Logged User:', student_id, username, avatar);
    console.log('Access Token:', accessToken);
    ///////////////////////////////////////////////////////////////////
    const details = { username, student_id, avatar };

    return await this.authService.validateUser(details);
  }
}
