import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private httpService: HttpService,
  ) {}

  @Get('log')
  async log() {
    const res = this.httpService.get('https://api.intra.42.fr');
    return res;
  }

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }
}
