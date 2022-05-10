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
import MutedUser from './entities/muted.user.entity';
import BanedUser from './entities/baned.user.entity';
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
      select: ['id', 'username', 'avatar', 'studentID', 'githubID', 'socketID'],
      relations: [
        // Below: For DEBUG, may remove later
        // 'stats',
        // 'friends',
        // 'friendsInverse',
        // 'blockedUsers',
        // 'blockedUsersInverse',
        // 'messages',
        // 'messages.channel',
        // 'playedMatches',
        // 'winMatches',
        // 'ownerChannels',
        // 'adminChannels',
        // 'memberChannels',
        // 'muteChannels',
        // 'muteChannels.channel',
        // 'banChannels',
        // 'banChannels.channel',
        // 'inviteChannels',
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
      'blockedUsers',
      'blockedUsersInverse',
      'messages',
      'messages.channel',
      'playedMatches',
      'winMatches',
      'ownerChannels',
      'adminChannels',
      'memberChannels',
      'muteChannels',
      'muteChannels.channel',
      'banChannels',
      'banChannels.channel',
      'inviteChannels',
    ],
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userID },
      select: ['id', 'username', 'avatar', 'studentID', 'githubID', 'socketID'],
      relations: relations,
    });
    if (!user) throw new NotFoundException('User not found (id incorrect)');
    else return user;
  }

  async getUsersByFilter(filter: FilterUserDTO): Promise<User[]> {
    const query = this.usersRepository
      .createQueryBuilder('users')
      .orderBy('users.id', 'ASC');

    // Search parameters
    if ('id' in filter) query.andWhere('users.id = :id', { id: filter.id });
    if ('username' in filter)
      query.andWhere('users.username = :username', {
        username: filter.username,
      });
    if ('studID' in filter)
      query.andWhere('users.studentID = :studID', {
        studID: filter.studID,
      });
    if ('gitID' in filter)
      query.andWhere('users.githubID = :gitID', {
        gitID: filter.gitID,
      });

    // Fetch field parameters
    if ('password' in filter) query.addSelect('users.password');
    if ('studentID' in filter) query.addSelect('users.studentID');
    if ('githubID' in filter) query.addSelect('users.githubID');
    if ('socketID' in filter) query.addSelect('users.socketID');
    if ('stats' in filter) query.leftJoinAndSelect('users.stats', 'stats');
    if ('friends' in filter)
      query.leftJoinAndSelect('users.friends', 'friends');
    if ('friendsInverse' in filter)
      query.leftJoinAndSelect('users.friendsInverse', 'friendsInverse');
    if ('blockedUsers' in filter)
      query.leftJoinAndSelect('users.blockedUsers', 'blockedUsers');
    if ('blockedUsersInverse' in filter)
      query.leftJoinAndSelect(
        'users.blockedUsersInverse',
        'blockedUsersInverse',
      );
    if ('playedMatches' in filter)
      query.leftJoinAndSelect('users.playedMatches', 'playedMatches');
    if ('winMatches' in filter)
      query.leftJoinAndSelect('users.winMatches', 'winMatches');
    if ('messages' in filter)
      query.leftJoinAndSelect('users.messages', 'messages');
    if ('ownerChannels' in filter)
      query.leftJoinAndSelect('users.ownerChannels', 'ownerChannels');
    if ('adminChannels' in filter)
      query.leftJoinAndSelect('users.adminChannels', 'adminChannels');
    if ('memberChannels' in filter)
      query.leftJoinAndSelect('users.memberChannels', 'memberChannels');
    if ('muteChannels' in filter)
      query
        .leftJoinAndSelect('users.muteChannels', 'muteChannels')
        .leftJoinAndSelect('muteChannels.channel', 'mute_channel');
    if ('banChannels' in filter)
      query
        .leftJoinAndSelect('users.banChannels', 'banChannels')
        .leftJoinAndSelect('banChannels.channel', 'ban_channel');
    if ('inviteChannels' in filter)
      query.leftJoinAndSelect('users.inviteChannels', 'inviteChannels');
    if ('refreshToken' in filter) query.addSelect('users.refreshToken');
    if ('twoFactorAuthenticationSecret' in filter)
      query.addSelect('users.twoFactorAuthenticationSecret');

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

    // Avatar
    userData.avatar = `https://avatars.dicebear.com/api/gridy/${userData.username}.svg`;

    // Creating a new user and it's stats
    const newUser = this.usersRepository.create(userData);
    const stats = this.statsRepository.create(new CreateStatsDTO());
    stats.user = newUser;
    await this.statsRepository.save(stats);

    delete newUser.socketID;
    delete newUser.password;
    delete newUser.refreshToken;
    delete newUser.twoFactorAuthenticationSecret;
    console.log('New user created: ', newUser);
    return newUser;
  }

  async updateUser(userID: number, updatedUser: UpdateUserDTO): Promise<User> {
    try {
      await this.validateUser(updatedUser);
      const user = await this.getUserByID(userID);

      // Checking what is updated
      if ('username' in updatedUser) user.username = updatedUser.username;
      if ('avatar' in updatedUser) user.avatar = updatedUser.avatar;
      if ('socketID' in updatedUser) user.socketID = updatedUser.socketID;
      if ('friends' in updatedUser) user.friends = updatedUser.friends;
      if ('addFriends' in updatedUser)
        user.friends = await this.addUsersToArray(
          updatedUser.addFriends,
          user.friends,
        );
      if ('removeFriends' in updatedUser)
        user.friends = await this.removeUsersFromArray(
          updatedUser.removeFriends,
          user.friends,
        );
      if (updatedUser.refreshToken)
        user.refreshToken = updatedUser.refreshToken;
      if (updatedUser.twoFactorAuthenticationSecret)
        user.twoFactorAuthenticationSecret =
          updatedUser.twoFactorAuthenticationSecret;
      if ('blockedUsers' in updatedUser)
        user.blockedUsers = updatedUser.blockedUsers;
      if ('addBlockedUsers' in updatedUser)
        user.blockedUsers = await this.addUsersToArray(
          updatedUser.addBlockedUsers,
          user.blockedUsers,
        );
      if ('removeBlockedUsers' in updatedUser)
        user.blockedUsers = await this.removeUsersFromArray(
          updatedUser.removeBlockedUsers,
          user.blockedUsers,
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

  // User related
  async getUserFriends(userID: number): Promise<User[]> {
    try {
      const user = await this.getUserByID(userID, ['friends']);
      return user.friends;
    } catch (error) {
      throw error;
    }
  }

  async getUserFriendsInverse(userID: number): Promise<User[]> {
    try {
      const user = await this.getUserByID(userID, ['friendsInverse']);
      return user.friendsInverse;
    } catch (error) {
      throw error;
    }
  }

  async getBlockedUsers(userID: number): Promise<User[]> {
    try {
      const user = await this.getUserByID(userID, ['usersBlocked']);
      return user.blockedUsers;
    } catch (error) {
      throw error;
    }
  }

  async getBlockedUsersInverse(userID: number): Promise<User[]> {
    try {
      const user = await this.getUserByID(userID, ['usersBlockedInverse']);
      return user.blockedUsersInverse;
    } catch (error) {
      throw error;
    }
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

  async getUserChannelsMuted(userID: number): Promise<MutedUser[]> {
    try {
      const user = await this.getUserByID(userID, ['muteChannels']);
      return user.muteChannels;
    } catch (error) {
      throw error;
    }
  }

  async getUserChannelsBaned(userID: number): Promise<BanedUser[]> {
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

  async validateUser(user: UpdateUserDTO): Promise<void> {
    // Checking if username already exist
    if ('username' in user) {
      if (
        await this.usersRepository.findOne({
          where: { username: user.username },
        })
      )
        throw new ForbiddenException(
          "Can't update username (username already exists)",
        );
    }

    // Checking if all friends exist
    if ('friends' in user) {
      for (const friend of user.friends) {
        if ((await this.usersRepository.count(friend)) === 0)
          throw new ForbiddenException(
            "Can't update friends (friend does not exists)",
          );
      }
    }
    // Checking if all addFriends exist
    if ('addFriends' in user) {
      for (const friend of user.addFriends) {
        if ((await this.usersRepository.count(friend)) === 0)
          throw new ForbiddenException(
            "Can't update friends (added friend does not exists)",
          );
      }
    }
    // Checking if all removeFriends exist
    if ('removeFriends' in user) {
      for (const friend of user.removeFriends) {
        if ((await this.usersRepository.count(friend)) === 0)
          throw new ForbiddenException(
            "Can't update friends (removed friend does not exists)",
          );
      }
    }
    if ('blockedUsers' in user) {
      for (const blockedUser of user.blockedUsers) {
        if ((await this.usersRepository.count(blockedUser)) === 0)
          throw new ForbiddenException(
            "Can't update blocked users (blocked user does not exists)",
          );
      }
    }
    // Checking if all addFriends exist
    if ('addBlockedUsers' in user) {
      for (const blockedUser of user.addBlockedUsers) {
        if ((await this.usersRepository.count(blockedUser)) === 0)
          throw new ForbiddenException(
            "Can't update blocke users (added blocked user does not exists)",
          );
      }
    }
    // Checking if all removeFriends exist
    if ('removeBlockedUsers' in user) {
      for (const blockedUser of user.removeBlockedUsers) {
        if ((await this.usersRepository.count(blockedUser)) === 0)
          throw new ForbiddenException(
            "Can't update blocked users (removed blocked user does not exists)",
          );
      }
    }
  }

  async getUserIfRefreshToken(refreshToken: string, userID: number) {
    const [user] = await this.getUsersByFilter({
      id: userID,
      refreshToken: true,
    });
    if (user && user.refreshToken) {
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (isRefreshTokenMatching) {
        return user;
      }
    }
  }

  async removeRefreshToken(userID: number) {
    return this.usersRepository.update(userID, {
      refreshToken: null,
    });
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(user: User) {
    if (user.isTwoFactorAuthenticationEnabled == true) {
      return this.usersRepository.update(user.id, {
        twoFactorAuthenticationSecret: '',
        isTwoFactorAuthenticationEnabled: false,
      });
    }
    return this.usersRepository.update(user.id, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }
}
