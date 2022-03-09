import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthenticationProvider } from '../auth.interface';

// Invoke the 42 API Authentication Service
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id: github_id, username, photos } = profile;
    const { value: avatar } = photos[0];

    /////////////////////////////////////// DEBUG
    console.log(profile);
    console.log('Logged User:', github_id, username, avatar);
    console.log('Access Token:', accessToken);
    ///////////////////////////////////////////////////////////////////
    const details = { username, github_id, avatar };

    return await this.authService.validateUserGithub(details);
  }
}
