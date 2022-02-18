import {
  Injectable,
  HttpStatus,
  HttpException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import {Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  private users: User[] = [
    { login: 'josaykos' },
    { login: 'lchapren' },
    { login: 'mabriand' },
    { login: 'adupuy' },
    { login: 'vmoreau' },
  ];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserByLogin(login: string): User {
    const user = this.users.find((user) => user.login === login);
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found (login not correct)');
  }

  @HttpCode(HttpStatus.CREATED)
  createUser(user: CreateUserDTO) {
    this.users.push(user);
    return user;
  }

  updateUser(login: string, updatedUser: CreateUserDTO) {
    const userIndex = this.users.findIndex((user) => user.login === login);
    if (userIndex == -1) this.createUser(updatedUser);
    else this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  // @HttpCode(HttpStatus.ACCEPTED)
  deleteUser(login: string) {
    const userIndex = this.users.findIndex((user) => user.login === login);
    if (userIndex === -1)
      throw new HttpException('User does not exists', HttpStatus.ACCEPTED);
    else {
      this.users.splice(userIndex, 1);
      throw new HttpException('User deleted', HttpStatus.NO_CONTENT);
    }
  }
}
