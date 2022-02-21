import {
  Injectable,
  HttpStatus,
  HttpException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    return users;
  }

  async getUserByID(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found (id not correct)');
  }

  async getUserByUsername(username: string): Promise<User[]> {
    const user = await this.usersRepository.find({
      where: { username: username },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found (username not correct)');
  }

  @HttpCode(HttpStatus.CREATED)
  async createUser(user: CreateUserDTO): Promise<User> {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: number, updatedUser: CreateUserDTO): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) this.createUser(updatedUser);
    else await this.usersRepository.update(id, updatedUser);

    return updatedUser;
  }

  // @HttpCode(HttpStatus.ACCEPTED)
  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user)
      throw new HttpException('User does not exists', HttpStatus.ACCEPTED);
    else {
      this.usersRepository.delete(user);
      throw new HttpException('User deleted', HttpStatus.NO_CONTENT);
    }
  }
}
