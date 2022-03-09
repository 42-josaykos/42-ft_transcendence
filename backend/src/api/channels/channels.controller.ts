import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { CreateChannelDTO } from './dto/create-channel.dto';
import Channel from './entities/channel.entity';
import User from 'src/api/users/entities/user.entity';

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async getAllChannels(): Promise<Channel[]> {
    return await this.channelsService.getAllChannels();
  }

  @Get(':id')
  async getChannelByID(@Param('id') channelID: number): Promise<Channel> {
    return await this.channelsService.getChannelByID(channelID);
  }

  @Get(':id/name')
  async getChannelName(@Param('id') channelID: number): Promise<string> {
    return await this.channelsService.getChannelName(channelID);
  }

  @Get(':id/privacy')
  async getChannelPrivacy(@Param('id') channelID: number): Promise<boolean> {
    return await this.channelsService.getChannelPrivacy(channelID);
  }

  @Get(':id/password')
  async getChannelPassword(@Param('id') channelID: number): Promise<string> {
    return await this.channelsService.getChannelPassword(channelID);
  }

  @Get(':id/owner')
  async getChannelOwner(@Param('id') channelID: number): Promise<User> {
    return await this.channelsService.getChannelOwner(channelID);
  }

  @Get(':id/admins')
  async getChannelAdmins(@Param('id') channelID: number): Promise<User[]> {
    return await this.channelsService.getChannelAdmins(channelID);
  }

  @Get(':id/members')
  async getChannelMembers(@Param('id') channelID: number): Promise<User[]> {
    return await this.channelsService.getChannelMembers(channelID);
  }

  @Get(':id/mutes')
  async getChannelMutes(@Param('id') channelID: number): Promise<User[]> {
    return await this.channelsService.getChannelMutes(channelID);
  }

  @Get(':id/bans')
  async getChannelBans(@Param('id') channelID: number): Promise<User[]> {
    return await this.channelsService.getChannelBans(channelID);
  }

  @Post()
  async createChannel(@Body() channel: CreateChannelDTO): Promise<Channel> {
    return await this.channelsService.createChannel(channel);
  }

  @Delete(':id')
  async deleteChannel(@Param('id') channelID: number): Promise<void> {
    return await this.channelsService.deleteChannel(channelID);
  }
}
