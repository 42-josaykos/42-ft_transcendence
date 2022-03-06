import { Injectable } from '@nestjs/common';
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
  validateUser() {
    return;
  }
  createUser() {
    return;
  }

  findUser() {
    return;
  }
}
