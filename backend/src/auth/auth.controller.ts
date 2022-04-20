import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestWithUser } from './auth.interface';
import {
  JwtAccessGuard,
  AuthenticatedGuard,
  FortyTwoAuthGuard,
  GithubGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
} from './guards';
import { AuthenticationProvider } from './auth.interface';
import { Inject } from '@nestjs/common';
import { twoFactorAuthenticationCodeDTO } from './dto/twoFactorAuthenticationCode.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {}
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

  @Post('login/local')
  @UseGuards(LocalAuthGuard)
  async loginLocal(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshToken = this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.authService.setCurrentRefreshToken(refreshToken.token, user.id);
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshToken.cookie]);
    return res.send(user);
  }

  /**
   * GET /auth/redirect
   * This is the redirect URL the OAuth2 provider will call
   */
  @Get('redirect')
  @Redirect('/')
  @UseGuards(FortyTwoAuthGuard)
  async redirect(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshToken = this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.authService.setCurrentRefreshToken(refreshToken.token, user.id);
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshToken.cookie]);
    return;
  }

  @Get('redirect/github')
  @Redirect('/')
  @UseGuards(GithubGuard)
  async redirectGithub(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshToken = this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.authService.setCurrentRefreshToken(refreshToken.token, user.id);
    res.setHeader('Set-Cookie', [accessTokenCookie, refreshToken.cookie]);
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

  @Get('jwt-status')
  @UseGuards(JwtAccessGuard)
  jwtStatus(@Req() req: RequestWithUser) {
    const { id, username, avatar } = req.user;
    return { id, username, avatar };
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  jwtRefresh(@Req() req: RequestWithUser, @Res() res) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      req.user.id,
    );
    res.setHeader('Set-Cookie', accessTokenCookie);
    const { id, username, avatar } = req.user;
    return res.send({ id, username, avatar });
  }

  @Post('generate-2fa')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAccessGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        request.user,
      );
    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('turn-2fa-on')
  @UseGuards(JwtAccessGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: twoFactorAuthenticationCodeDTO,
  ) {
    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        request.user.id,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.authService.turnOnTwoFactorAuthentication(request.user.id);
  }

  /**
   * GET /auth/logout
   * Logging the user out
   */
  @Get('logout')
  @Redirect('/')
  async logout(@Req() req, @Res() res: Response) {
    await this.authService.removeRefreshToken(req.user.id);
    res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    req.logOut();
  }
}
