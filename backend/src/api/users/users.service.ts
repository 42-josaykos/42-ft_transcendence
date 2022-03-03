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
import { CreateStatsDTO } from '../stats/dto/create-stats.dto';
import User from './entities/user.entity';
import Stats from '../stats/entities/stats.entity';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Stats)
    private statsRepository: Repository<Stats>,
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
    // Creating and saving new  user
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);

    // Initializing stats
    const stats = this.statsRepository.create(new CreateStatsDTO());
    stats.user = newUser;
    await this.statsRepository.save(stats);

    return newUser;
  }

  async updateUser(id: number, updatedUser: CreateUserDTO): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) return this.createUser(updatedUser);
    else await this.usersRepository.update(id, updatedUser);

    return await this.usersRepository.findOne({
      where: { id: id },
    });
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
