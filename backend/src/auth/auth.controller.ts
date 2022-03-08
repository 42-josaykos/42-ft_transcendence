import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, FortyTwoAuthGuard } from './guards';

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

  /**
   * GET /auth/redirect
   * This is the redirect URL the OAuth2 provider will call
   */
  @Get('redirect')
  @Redirect('/game')
  @UseGuards(FortyTwoAuthGuard)
  async redirect() {
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
  }
}
