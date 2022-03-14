import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDTO } from './dto/create-channel.dto';
import User from 'src/api/users/entities/user.entity';
import Channel from './entities/channel.entity';
import Message from 'src/api/messages/entities/message.entity';

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

  async validateChannel(newChannel: Channel): Promise<void> {
    // Checking if owner exists
    if ((await this.usersRepository.count(newChannel.owner)) === 0)
      throw new ForbiddenException(
        "Can't create channel (owner does not exists)",
      );
    // Checking if all admins exist
    if (newChannel.admins) {
      for (const admin of newChannel.admins) {
        if ((await this.usersRepository.count(admin)) === 0)
          throw new ForbiddenException(
            "Can't create channel (admin does not exists)",
          );
      }
    }
    // Checking if all members exist
    for (const member of newChannel.members) {
      if ((await this.usersRepository.count(member)) === 0)
        throw new ForbiddenException(
          "Can't create channel (member does not exists)",
        );
    }
    // Checking if all mutes exist
    if (newChannel.mutes) {
      for (const mute of newChannel.mutes) {
        if ((await this.usersRepository.count(mute)) === 0)
          throw new ForbiddenException(
            "Can't create channel (muted member does not exists)",
          );
      }
    }
    // Checking if all bans exist
    if (newChannel.bans) {
      for (const ban of newChannel.bans) {
        if ((await this.usersRepository.count(ban)) === 0)
          throw new ForbiddenException(
            "Can't create channel (baned member does not exists)",
          );
      }
    }
  }

  async createChannel(channel: CreateChannelDTO): Promise<Channel> {
    try {
      const newChannel = this.channelsRepository.create(channel);
      await this.validateChannel(newChannel);
      await this.channelsRepository.save(newChannel);
      return newChannel;
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
}
