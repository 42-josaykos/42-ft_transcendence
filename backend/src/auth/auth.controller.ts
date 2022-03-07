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
  login() {
    return;
  }

  /**
   * GET /auth/redirect
   * This is the redirect URL the OAuth2 provider will call
   */
  @Get('redirect')
  @Redirect('/game')
  @UseGuards(FortyTwoAuthGuard)
  redirect() {
    return;
  }

  /**
   * GET /auth/status
   * Retrieve the auth status
   */
  @Get('status')
  @UseGuards(AuthenticatedGuard)
  status(@Req() req) {
    return req.user;
  }

  /**
   * GET /auth/logout
   * Logging the user out
   */
  @Get('logout')
  @Redirect('/')
  logout(@Req() req) {
    req.logOut();
  }
}
