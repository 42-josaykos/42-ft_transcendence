import { CreateUserDTO } from 'src/api/users/dto/create-user.dto';
import User from 'src/api/users/entities/user.entity';
import { Request, Response } from 'express';

export interface AuthenticationProvider {
  validateUser(details: CreateUserDTO);
  validateUserGithub(details: CreateUserDTO);
  validateUserLocal(username: string, plainPassword: string);
  createUser(details: CreateUserDTO);
  findUser(id: number): Promise<User | undefined>;
  getCookieWithJwtAccessToken(
    userID: number,
    isSecondFactorAuthenticated?: boolean,
  ): string;
  getCookieWithJwtRefreshToken(userId: number);
  setCurrentRefreshToken(refreshToken: string, userId: number);
  getCookieForLogout();
  removeRefreshToken(userId: number);
  generateTwoFactorAuthenticationSecret(user: User);
  pipeQrCodeStream(stream: Response, otpauthUrl: string);
  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    userId: number,
  );
  turnOnTwoFactorAuthentication(user: User);
}

export type Done = (err: Error, user: User) => void;

export interface TokenPayload {
  userID: number;
  isSecondFactorAuthenticated?: boolean;
}

export interface RequestWithUser extends Request {
  user: User;
}
