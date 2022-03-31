import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDTO } from './dto/update-channel.dto';
import User from 'src/api/users/entities/user.entity';
import Channel from './entities/channel.entity';
import Message from 'src/api/messages/entities/message.entity';
import { FilterChannelDTO } from './dto/filter-channel.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAllChannels(): Promise<Channel[]> {
    const channels = await this.channelsRepository.find();
    return channels;
  }

  async getChannelByID(
    channelID: number,
    relations: string[] = [
      'messages',
      'messages.author',
      'owner',
      'admins',
      'members',
      'mutes',
      'bans',
      'invites',
    ],
  ): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { id: channelID },
      relations: relations,
    });
    if (!channel)
      throw new NotFoundException('Channel not found (id incorrect)');
    return channel;
  }

  async getChannelsByFilter(filter: FilterChannelDTO): Promise<Channel[]> {
    const query = this.channelsRepository
      .createQueryBuilder('channels')
      .orderBy('channels.id', 'ASC');

    // Search parameters
    if ('id' in filter) query.andWhere('channels.id = :id', { id: filter.id });
    if ('name' in filter)
      query.andWhere('channels.name = :name', {
        name: filter.name,
      });
    if ('isPrivate' in filter)
      query.andWhere('channels.isPrivate = :isPrivate', {
        isPrivate: filter.isPrivate,
      });
      if ('isDirectChannel' in filter)
      query.andWhere('channels.isDirectChannel = :isDirectChannel', {
        isDirectChannel: filter.isDirectChannel,
      });

    // Fetch field parameters
    if ('password' in filter) query.addSelect('channels.password');
    if ('messages' in filter)
      query
        .leftJoinAndSelect('channels.messages', 'messages')
        .leftJoinAndSelect('messages.author', 'author');
    if ('owner' in filter)
      query
        .leftJoinAndSelect('channels.owner', 'owner')
        .addSelect('owner.socketID');
    if ('admins' in filter)
      query
        .leftJoinAndSelect('channels.admins', 'admins')
        .addSelect('admins.socketID');
    if ('members' in filter)
      query
        .leftJoinAndSelect('channels.members', 'members')
        .addSelect('members.socketID');
    if ('mutes' in filter)
      query
        .leftJoinAndSelect('channels.mutes', 'mutes')
        .addSelect('mutes.socketID');
    if ('bans' in filter)
      query
        .leftJoinAndSelect('channels.bans', 'bans')
        .addSelect('bans.socketID');
    if ('invites' in filter)
      query
        .leftJoinAndSelect('channels.invites', 'invites')
        .addSelect('invites.socketID');

    const channels = await query.getMany();
    if (!channels.length)
      throw new NotFoundException('Channels not found (filter incorrect)');
    return channels;
  }

  async getChannelName(channelID: number): Promise<string> {
    try {
      const channel = await this.getChannelByID(channelID);
      return channel.name;
    } catch (error) {
      throw error;
    }
  }

  async getChannelPrivacy(channelID: number): Promise<boolean> {
    try {
      const channel = await this.getChannelByID(channelID);
      return channel.isPrivate;
    } catch (error) {
      throw error;
    }
  }

  async getChannelPassword(channelID: number): Promise<string> {
    try {
      const channel = await this.getChannelByID(channelID);
      return channel.password;
    } catch (error) {
      throw error;
    }
  }

  async getChannelMessages(channelID: number): Promise<Message[]> {
    try {
      const channel = await this.getChannelByID(channelID);
      return channel.messages;
    } catch (error) {
      throw error;
    }
  }

  async getChannelOwner(channelID: number): Promise<User> {
    try {
      const channel = await this.getChannelByID(channelID, ['owner']);
      return channel.owner;
    } catch (error) {
      throw error;
    }
  }

  async getChannelAdmins(channelID: number): Promise<User[]> {
    try {
      const channel = await this.getChannelByID(channelID, ['admins']);
      return channel.admins;
    } catch (error) {
      throw error;
    }
  }

  async getChannelMembers(channelID: number): Promise<User[]> {
    try {
      const channel = await this.getChannelByID(channelID, ['members']);
      return channel.members;
    } catch (error) {
      throw error;
    }
  }

  async getChannelMutes(channelID: number): Promise<User[]> {
    try {
      const channel = await this.getChannelByID(channelID, ['mutes']);
      return channel.mutes;
    } catch (error) {
      throw error;
    }
  }

  async getChannelBans(channelID: number): Promise<User[]> {
    try {
      const channel = await this.getChannelByID(channelID, ['bans']);
      return channel.bans;
    } catch (error) {
      throw error;
    }
  }

  async getChannelInvites(channelID: number): Promise<User[]> {
    try {
      const channel = await this.getChannelByID(channelID, ['invites']);
      return channel.invites;
    } catch (error) {
      throw error;
    }
  }

  async createChannel(channel: CreateChannelDTO): Promise<Channel> {
    try {
      await this.validateChannel(channel);
      const count = await this.channelsRepository.count({
        where: { name: channel.name },
      });
      if (count > 0)
        throw new ForbiddenException(
          "Can't create new Channel (name must be unique)",
        );
      
      const channelData = { ...channel };
      if (channelData.password) {
        const hash = await bcrypt.hash(channel.password, 10);
        channelData.password = hash;
      }

      const newChannel = this.channelsRepository.create(channelData);
      await this.channelsRepository.save(newChannel);

      delete newChannel.password
      return newChannel;
    } catch (error) {
      throw error;
    }
  }

  async updateChannel(
    channelID: number,
    updatedChannel: UpdateChannelDTO,
  ): Promise<Channel> {
    try {
      await this.validateChannel(updatedChannel);
      const channel = await this.getChannelByID(channelID);
      //Checking what is updated
      if (updatedChannel.name) channel.name = updatedChannel.name;
      /*if (updatedChannel.isPrivate)*/
        channel.isPrivate = updatedChannel.isPrivate;
      /*if (updatedChannel.password) */channel.password = updatedChannel.password;
      if (updatedChannel.owner) channel.owner = updatedChannel.owner;
      if (updatedChannel.admins) channel.admins = updatedChannel.admins;
      if (updatedChannel.members) channel.members = updatedChannel.members;
      if (updatedChannel.mutes) channel.mutes = updatedChannel.mutes;
      if (updatedChannel.bans) channel.bans = updatedChannel.bans;
      if (updatedChannel.invites) channel.invites = updatedChannel.invites;
      if (updatedChannel.addAdmins)
        channel.admins = await this.addUsersToArray(
          updatedChannel.addAdmins,
          channel.admins,
        );
      if (updatedChannel.removeAdmins)
        channel.admins = await this.removeUsersFromArray(
          updatedChannel.removeAdmins,
          channel.admins,
        );
      if (updatedChannel.addMembers)
        channel.members = await this.addUsersToArray(
          updatedChannel.addMembers,
          channel.members,
        );
      if (updatedChannel.removeMembers)
        channel.members = await this.removeUsersFromArray(
          updatedChannel.removeMembers,
          channel.members,
        );
      if (updatedChannel.addMutes)
        channel.mutes = await this.addUsersToArray(
          updatedChannel.addMutes,
          channel.mutes,
        );
      if (updatedChannel.removeMutes)
        channel.mutes = await this.removeUsersFromArray(
          updatedChannel.removeMutes,
          channel.mutes,
        );
      if (updatedChannel.addBans)
        channel.bans = await this.addUsersToArray(
          updatedChannel.addBans,
          channel.bans,
        );
      if (updatedChannel.removeBans)
        channel.bans = await this.removeUsersFromArray(
          updatedChannel.removeBans,
          channel.bans,
        );
      if (updatedChannel.addInvites)
        channel.invites = await this.addUsersToArray(
          updatedChannel.addInvites,
          channel.invites,
        );
      if (updatedChannel.removeInvites)
        channel.invites = await this.removeUsersFromArray(
          updatedChannel.removeInvites,
          channel.invites,
        );

      await this.channelsRepository.save(channel);
      return await this.getChannelByID(channelID);
    } catch (error) {
      throw error;
    }
  }

  async deleteChannel(channelID: number): Promise<void> {
    try {
      const channel = await this.getChannelByID(channelID);
      await this.channelsRepository.remove(channel);
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

  async validateChannel(
    channel: CreateChannelDTO | UpdateChannelDTO,
  ): Promise<void> {
    // Checking if owner exists
    if (
      channel.owner &&
      (await this.usersRepository.count(channel.owner)) === 0
    )
      throw new ForbiddenException(
        "Can't create / update channel (owner does not exists)",
      );
    // Checking if all admins exist
    if (channel.admins) {
      for (const admin of channel.admins) {
        if ((await this.usersRepository.count(admin)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (admin does not exists)",
          );
      }
    }
    // Checking if all members exist
    if (channel.members) {
      for (const member of channel.members) {
        if ((await this.usersRepository.count(member)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (member does not exists)",
          );
      }
    }
    // Checking if all mutes exist
    if (channel.mutes) {
      for (const mute of channel.mutes) {
        if ((await this.usersRepository.count(mute)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (muted member does not exists)",
          );
      }
    }
    // Checking if all bans exist
    if (channel.bans) {
      for (const ban of channel.bans) {
        if ((await this.usersRepository.count(ban)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (baned member does not exists)",
          );
      }
    }
    // Checking if all invites exist
    if (channel.invites) {
      for (const invite of channel.invites) {
        if ((await this.usersRepository.count(invite)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (invited member does not exists)",
          );
      }
    }
    // Checking if all addAdmins exist
    if ('addAdmins' in channel) {
      for (const admin of channel.addAdmins) {
        if ((await this.usersRepository.count(admin)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (added admin does not exists)",
          );
      }
    }
    // Checking if all removeAdmins exist
    if ('removeAdmins' in channel) {
      for (const admin of channel.removeAdmins) {
        if ((await this.usersRepository.count(admin)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (removed admin does not exists)",
          );
      }
    }
    // Checking if all addMembers exist
    if ('addMembers' in channel) {
      for (const member of channel.addMembers) {
        if ((await this.usersRepository.count(member)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (added member does not exists)",
          );
      }
    }
    // Checking if all removeMembers exist
    if ('removeMembers' in channel) {
      for (const member of channel.removeMembers) {
        if ((await this.usersRepository.count(member)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (removed member does not exists)",
          );
      }
    }
    // Checking if all addMutes exist
    if ('addMutes' in channel) {
      for (const muted of channel.addMutes) {
        if ((await this.usersRepository.count(muted)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (added muted member does not exists)",
          );
      }
    }
    // Checking if all removeMutes exist
    if ('removeMutes' in channel) {
      for (const muted of channel.removeMutes) {
        if ((await this.usersRepository.count(muted)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (removed muted member does not exists)",
          );
      }
    }
    // Checking if all addBans exist
    if ('addBans' in channel) {
      for (const baned of channel.addBans) {
        if ((await this.usersRepository.count(baned)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (added baned member does not exists)",
          );
      }
    }
    // Checking if all removeBans exist
    if ('removeBans' in channel) {
      for (const baned of channel.removeBans) {
        if ((await this.usersRepository.count(baned)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (removed baned member does not exists)",
          );
      }
    }
    // Checking if all addInvites exist
    if ('addInvites' in channel) {
      for (const invited of channel.addInvites) {
        if ((await this.usersRepository.count(invited)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (added invited member does not exists)",
          );
      }
    }
    // Checking if all removeInvites exist
    if ('removeInvites' in channel) {
      for (const invited of channel.removeInvites) {
        if ((await this.usersRepository.count(invited)) === 0)
          throw new ForbiddenException(
            "Can't create / update channel (removed invited member does not exists)",
          );
      }
    }
  }
}
