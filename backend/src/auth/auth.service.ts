import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationProvider, TokenPayload } from './auth.interface';
import User from 'src/api/users/entities/user.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Done } from './auth.interface';
import { UsersService } from 'src/api/users/users.service';
import { CreateUserDTO } from 'src/api/users/dto/create-user.dto';
import { FilterUserDTO } from 'src/api/users/dto/filter-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

/**
 * Create a new student user if not found in database
 */
@Injectable()
export class AuthService implements AuthenticationProvider {
  constructor(
    @Inject('USERS_SERVICE')
    private usersService: UsersService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 42 Api auth validation
   */
  async validateUser(details: CreateUserDTO) {
    const { studentID } = details;
    try {
      const [user] = await this.usersService.getUsersByFilter({
        studID: studentID,
      });
      // console.log(user);

      return user;
    } catch (error) {
      return await this.createUser(details);
    }
  }

  /**
   * Github Api auth validation
   */
  async validateUserGithub(details: CreateUserDTO) {
    const { githubID } = details;
    try {
      const [user] = await this.usersService.getUsersByFilter({
        gitID: githubID,
      });
      // console.log(user);

      return user;
    } catch (error) {
      return await this.createUser(details);
    }
  }

  /**
   * username/password auth validation
   */
  async validateUserLocal(username: string, plainPassword: string) {
    try {
      const filter: FilterUserDTO = { username: username, password: true };
      const [user] = await this.usersService.getUsersByFilter(filter);

      const isPasswordMatching = await bcrypt.compare(
        plainPassword,
        user.password,
      );
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...retUser } = user;
      return retUser;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  createUser(details: CreateUserDTO) {
    return this.usersService.createUser(details);
  }

  async findUser(id: number) {
    const [user] = await this.usersService.getUsersByFilter({ id: id });
    return user;
  }

  /*****************************************************************************
   * Jwt
   */
  public getCookieWithJwtAccessToken(userID: number) {
    const payload: TokenPayload = { userID };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_EXPIRATION_TIME')}s`,
    });
    return `Authentication=${token}; Secure; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_EXPIRATION_TIME',
    )}`;
  }

  public getCookieWithJwtRefreshToken(userID: number) {
    const payload: TokenPayload = { userID };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/auth/refresh; Max-Age=${this.configService.get(
      'JWT_REFRESH_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }

  async setCurrentRefreshToken(token: string, userID: number) {
    const refreshToken = await bcrypt.hash(token, 10);
    await this.usersService.updateUser(userID, { refreshToken });
  }

  public getCookieForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async removeRefreshToken(userID: number) {
    return this.usersService.removeRefreshToken(userID);
  }

  /*****************************************************************************
   * 2-FA
   */
  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.username,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    userId: number,
  ) {
    const filter = {
      id: userId,
      twoFactorAuthenticationSecret: true,
    };

    const [user] = await this.usersService.getUsersByFilter(filter);

    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  public async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersService.turnOnTwoFactorAuthentication(userId);
  }
}

/*******************************************************************************
 * Handle session store in DB
 */

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super();
  }

  serializeUser(user: User, done: Done) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Done) {
    const userDB = await this.authService.findUser(user.id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
