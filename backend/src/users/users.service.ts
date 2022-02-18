import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export default class UsersService {
  private users: User[] = [{ login: 'test' }, { login: 'test2' }];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserByLogin(login: string): User {
    const user = this.users.find((user) => user.login === login);
    if (user) {
      return user;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  createUser(user: CreateUserDTO) {
    this.users.push(user);
    return user;
  }
}
