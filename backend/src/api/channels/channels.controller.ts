import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { CreateChannelDTO } from './dto/create-channel.dto';
import Channel from './entities/channel.entity';

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

  @Post()
  async createChannel(@Body() channel: CreateChannelDTO): Promise<Channel> {
    return await this.channelsService.createChannel(channel);
  }
}
