import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDTO } from './dto/create-channel.dto';
import User from 'src/api/users/entities/user.entity';
import Channel from './entities/channel.entity';

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
    relations: string[] = [],
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

  async createChannel(channel: CreateChannelDTO): Promise<Channel> {
    const newChannel = this.channelsRepository.create(channel);
    const owner = await this.usersRepository.findOne({
      where: newChannel.owner,
    });

    if (!owner)
      throw new NotFoundException(
        "Can't create channel (owner does not exists)",
      );
    else {
      await this.channelsRepository.save(newChannel);
      return newChannel;
    }
  }

  async deleteChannel(channelID: number): Promise<void> {
    const channel = await this.channelsRepository.findOne({
      where: { id: channelID },
      relations: ['owner', 'admins', 'members', 'mutes', 'bans'],
    });
    if (!channel)
      throw new NotFoundException('Channel not found (id incorrect)');
    else await this.channelsRepository.remove(channel);
  }
}
