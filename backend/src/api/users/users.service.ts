import {
  Injectable,
  HttpStatus,
  NotFoundException,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { CreateStatsDTO } from '../stats/dto/create-stats.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FilterUserDTO } from './dto/filter-user.dto';
import User from './entities/user.entity';
import Stats from 'src/api/stats/entities/stats.entity';
import Match from 'src/api/matches/entities/matches.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Stats)
    private statsRepository: Repository<Stats>,
  ) {}

  // CRUD related
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find({
      order: { id: 'ASC' },
      relations: [
        'stats',
        // Below: For DEBUG, may remove later
        'friends',
        'friendsInverse',
        'messages',
        'messages.channel',
        'playedMatches',
        'winMatches',
        'ownerChannels',
        'adminChannels',
        'memberChannels',
        'muteChannels',
        'banChannels',
        'inviteChannels',
      ],
    });
    return users;
  }

  async getUserByID(
    userID: number,
    relations: string[] = [
      'stats',
      'friends',
      'friendsInverse',
      'messages',
      'messages.channel',
      'playedMatches',
      'winMatches',
      'ownerChannels',
      'adminChannels',
      'memberChannels',
      'muteChannels',
      'banChannels',
      'inviteChannels',
    ],
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userID },
      relations: relations,
    });
    if (!user) throw new NotFoundException('User not found (id incorrect)');
    else return user;
  }

  async getUsersByFilter(
    filter: FilterUserDTO,
    showPassword: boolean = false,
  ): Promise<User[]> {
    const query = this.usersRepository
      .createQueryBuilder('users')
      .orderBy('id', 'ASC');

    if (showPassword) query.addSelect('users.password');
    if (filter.id) query.andWhere('users.id = :id', { id: filter.id });
    if (filter.username)
      query.andWhere('users.username = :username', {
        username: filter.username,
      });

    const users = await query.getMany();
    if (!users.length)
      throw new NotFoundException('Users not found (filter incorrect)');
    return users;
  }

  async getUserSocketID(userID: number): Promise<string> {
    try {
      const user = await this.usersRepository.findOne(userID);
      return user.socketID;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  async createUser(user: CreateUserDTO): Promise<User> {
    // If a User with this username already exists
    const count = await this.usersRepository.count({
      where: { username: user.username },
    });
    if (count > 0)
      throw new ForbiddenException(
        "Can't create new User (username must be unique)",
      );

    // Hashing password
    const userData = { ...user };
    if (userData.password) {
      const hash = await bcrypt.hash(user.password, 10);
      userData.password = hash;
    }

    // Creating a new user and it's stats
    const newUser = this.usersRepository.create(userData);
    const stats = this.statsRepository.create(new CreateStatsDTO());
    stats.user = newUser;
    await this.statsRepository.save(stats);

    return newUser;
  }

  async updateUser(userID: number, updatedUser: UpdateUserDTO): Promise<User> {
    try {
      // MUST validate users in UpdateUserDTO
      const user = await this.getUserByID(userID);

      // Checking what is updated
      if (updatedUser.username) user.username = updatedUser.username;
      if (updatedUser.avatar) user.avatar = updatedUser.avatar;
      if (updatedUser.socketID) user.socketID = updatedUser.socketID;
      if (updatedUser.friends) user.friends = updatedUser.friends;
      if (updatedUser.addFriends)
        user.friends = await this.addUsersToArray(
          updatedUser.addFriends,
          user.friends,
        );
      if (updatedUser.removeFriends)
        user.friends = await this.removeUsersFromArray(
          updatedUser.removeFriends,
          user.friends,
        );

      await this.usersRepository.save(user);
      return await this.getUserByID(userID);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userID: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userID },
    });
    if (!user) throw new NotFoundException('User not found (id incorrect)');
    else await this.usersRepository.remove(user);
  }

  // Match related
  async getUserMatchesPlayed(userID: number): Promise<Match[]> {
    try {
      const user = await this.getUserByID(userID, ['playedMatches']);
      return user.playedMatches;
    } catch (error) {
      throw error;
    }
  }

  async getUserMatchesWon(userID: number): Promise<Match[]> {
    try {
      const user = await this.getUserByID(userID, ['winMatches']);
      return user.winMatches;
    } catch (error) {
      throw error;
    }
  }

  // Channel related
  async getUserChannelsOwned(userID: number): Promise<Channel[]> {
    try {
      const user = await this.getUserByID(userID, ['ownerChannels']);
      return user.ownerChannels;
    } catch (error) {
      throw error;
    }
  }

  async getUserChannelsAdmin(userID: number): Promise<Channel[]> {
    try {
      const user = await this.getUserByID(userID, ['adminChannels']);
      return user.adminChannels;
    } catch (error) {
      throw error;
    }
  }

  async getUserChannelsMember(userID: number): Promise<Channel[]> {
    try {
      const user = await this.getUserByID(userID, ['memberChannels']);
      return user.memberChannels;
    } catch (error) {
      throw error;
    }
  }

  async getUserChannelsMuted(userID: number): Promise<Channel[]> {
    try {
      const user = await this.getUserByID(userID, ['muteChannels']);
      return user.muteChannels;
    } catch (error) {
      throw error;
    }
  }

  async getUserChannelsBaned(userID: number): Promise<Channel[]> {
    try {
      const user = await this.getUserByID(userID, ['banChannels']);
      return user.banChannels;
    } catch (error) {
      throw error;
    }
  }

  async getUserChannelsInvites(userID: number): Promise<Channel[]> {
    try {
      const user = await this.getUserByID(userID, ['inviteChannels']);
      return user.inviteChannels;
    } catch (error) {
      throw error;
    }
  }

  async addUsersToArray(toAdd: User[], array: User[]) {
    toAdd.forEach((user) => {
      array.push(user);
    });
    return array;
  }

  async removeUsersFromArray(toRemove: User[], array: User[]) {
    array = array.filter(
      (user) => !toRemove.find((remove) => remove.id === user.id),
    );
    return array;
  }
}
