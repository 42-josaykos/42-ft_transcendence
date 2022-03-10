import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, FortyTwoAuthGuard, GithubGuard } from './guards';

@Controller('auth')
export class AuthController {
  /**
   * GET /auth/login
   * This is the route user will visit to authenticate
   */
  @Get('login')
  @UseGuards(FortyTwoAuthGuard)
  async login() {
    return;
  }

  @Get('login/github')
  @UseGuards(GithubGuard)
  async loginGithub() {
    return;
  }

  /**
   * GET /auth/redirect
   * This is the redirect URL the OAuth2 provider will call
   */
  @Get('redirect')
  @Redirect('/')
  @UseGuards(FortyTwoAuthGuard)
  async redirect() {
    return;
  }

  @Get('redirect/github')
  @Redirect('/')
  @UseGuards(GithubGuard)
  async redirectGithub() {
    return;
  }
  /**
   * GET /auth/status
   * Retrieve the auth status
   */
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  async status(@Req() req) {
    return req.user;
  }

  /**
   * GET /auth/logout
   * Logging the user out
   */
  @Get('logout')
  @Redirect('/')
  async logout(@Req() req) {
    req.logOut();
    req.session.cookie.maxAge = 0;
    req.session.destroy();
  }
}
