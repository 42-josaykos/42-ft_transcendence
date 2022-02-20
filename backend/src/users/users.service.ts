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

//   private users: User[] = [
//     { login: 'josaykos' },
//     { login: 'lchapren' },
//     { login: 'mabriand' },
//     { login: 'adupuy' },
//     { login: 'vmoreau' },
//   ];

  async getAllUsers(): Promise<User[]> {
      const users = await this.usersRepository.find();
      return users
  }

  async getUserByLogin(login: string): Promise<User> {
    const user = await this.usersRepository.findOne({where: {login: login}});
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found (login not correct)');
  }

  @HttpCode(HttpStatus.CREATED)
  async createUser(user: CreateUserDTO): Promise<User> {
    console.log("In create")
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return (newUser);
  }

  async updateUser(login: string, updatedUser: CreateUserDTO): Promise<User> {
    console.log("Verif user")
    console.log(login, updatedUser)
    const user = await this.usersRepository.findOne({where: {login: login}});
    if (!user) this.createUser(updatedUser);
    else
    {
      const alreadyExists = await this.usersRepository.findOne({where: {login: updatedUser.login}});
      if (!alreadyExists)
        await this.usersRepository.update(login, updatedUser);
    }
    return updatedUser;
  }

  // @HttpCode(HttpStatus.ACCEPTED)
  async deleteUser(login: string): Promise<void> {
    const user = await this.usersRepository.findOne({where: {login: login}});
    if (!user)
      throw new HttpException('User does not exists', HttpStatus.ACCEPTED);
    else {
      this.usersRepository.delete(user);
      throw new HttpException('User deleted', HttpStatus.NO_CONTENT);
    }
  }
}
