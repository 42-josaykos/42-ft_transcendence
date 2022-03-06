import { Controller, Get, Redirect } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';

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
  login() {
    return;
  }

  /**
   * GET /auth/redirect
   * This is the redirect URL the OAuth2 provider will call
   */
  @Get('redirect')
  @Redirect('/game')
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
