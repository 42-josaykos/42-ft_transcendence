import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './services/auth.service';
import { FortyTwoAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private httpService: HttpService,
  ) {}

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
  status() {
    return;
  }

  /**
   * GET /auth/logout
   * Logging the user out
   */
  @Get('logout')
  logout() {
    return;
  }
}
