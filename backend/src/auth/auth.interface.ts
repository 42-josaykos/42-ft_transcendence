import { CreateUserDTO } from 'src/api/users/dto/create-user.dto';
import User from 'src/api/users/entities/user.entity';
import { Request, Response } from 'express';

export interface AuthenticationProvider {
  validateUser(details: CreateUserDTO);
  validateUserGithub(details: CreateUserDTO);
  validateUserLocal(username: string, plainPassword: string);
  createUser(details: CreateUserDTO);
  findUser(id: number): Promise<User | undefined>;
  getCookieWithJwtAccessToken(userID: number): string;
  getCookieWithJwtRefreshToken(userID: number);
  setCurrentRefreshToken(refreshToken: string, userID: number);
  getCookieForLogout();
  removeRefreshToken(userID: number);
  generateTwoFactorAuthenticationSecret(user: User);
  pipeQrCodeStream(stream: Response, otpauthUrl: string);
  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    userId: number,
  );
  turnOnTwoFactorAuthentication(userId: number);
}

export type Done = (err: Error, user: User) => void;

export interface TokenPayload {
  userID: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
