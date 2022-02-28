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

  async getChannelByID(channelID: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { id: channelID },
    });
    if (!channel)
      throw new NotFoundException('Channel not found (id incorrect)');
    return channel;
  }

  async createChannel(channel: CreateChannelDTO): Promise<Channel> {
    const newChannel = this.channelsRepository.create(channel);
    await this.channelsRepository.save(newChannel);

    const owner = await this.usersRepository.findOne({ where: channel.owner });
    owner.channels.push(newChannel);
    await this.usersRepository.save(owner);

    return newChannel;
  }
}
