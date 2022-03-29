import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { CreateChannelDTO } from './dto/create-channel.dto';
import { UpdateChannelDTO } from './dto/update-channel.dto';
import { FilterChannelDTO } from './dto/filter-channel.dto';
import Channel from './entities/channel.entity';
import User from 'src/api/users/entities/user.entity';
import Message from 'src/api/messages/entities/message.entity';

@Controller('channels')
@ApiTags('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async getAllChannels(): Promise<Channel[]> {
    return await this.channelsService.getAllChannels();
  }

  @Get('search')
  async getChannelsByFilter(
    @Query() filter: FilterChannelDTO,
  ): Promise<Channel[]> {
    return await this.channelsService.getChannelsByFilter(filter);
  }

  @Get(':channelID')
  async getChannelByID(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<Channel> {
    return await this.channelsService.getChannelByID(channelID);
  }

  @Get(':channelID/name')
  async getChannelName(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<string> {
    return await this.channelsService.getChannelName(channelID);
  }

  @Get(':channelID/privacy')
  async getChannelPrivacy(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<boolean> {
    return await this.channelsService.getChannelPrivacy(channelID);
  }

  @Get(':channelID/password')
  async getChannelPassword(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<string> {
    return await this.channelsService.getChannelPassword(channelID);
  }

  @Get(':channelID/messages')
  async getChannelMessages(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<Message[]> {
    return await this.channelsService.getChannelMessages(channelID);
  }

  @Get(':channelID/owner')
  async getChannelOwner(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<User> {
    return await this.channelsService.getChannelOwner(channelID);
  }

  @Get(':channelID/admins')
  async getChannelAdmins(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<User[]> {
    return await this.channelsService.getChannelAdmins(channelID);
  }

  @Get(':channelID/members')
  async getChannelMembers(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<User[]> {
    return await this.channelsService.getChannelMembers(channelID);
  }

  @Get(':channelID/mutes')
  async getChannelMutes(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<User[]> {
    return await this.channelsService.getChannelMutes(channelID);
  }

  @Get(':channelID/bans')
  async getChannelBans(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<User[]> {
    return await this.channelsService.getChannelBans(channelID);
  }

  @Get(':channelID/invites')
  async getChannelInvites(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<User[]> {
    return await this.channelsService.getChannelInvites(channelID);
  }

  @Post()
  async createChannel(@Body() channel: CreateChannelDTO): Promise<Channel> {
    return await this.channelsService.createChannel(channel);
  }

  @Patch(':channelID')
  async updateChannel(
    @Param('channelID', ParseIntPipe) channelID: number,
    @Body() updatedChannel: UpdateChannelDTO,
  ): Promise<Channel> {
    return await this.channelsService.updateChannel(channelID, updatedChannel);
  }

  @Delete(':channelID')
  async deleteChannel(
    @Param('channelID', ParseIntPipe) channelID: number,
  ): Promise<void> {
    return await this.channelsService.deleteChannel(channelID);
  }
}

@Controller('/channels/:channelID/messages/:messageID')
@ApiTags('channels')
@ApiResponse({ status: HttpStatus.SEE_OTHER })
export class MessageRedirection {
  @Get()
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getChannelMessage(@Param('messageID', ParseIntPipe) messageID: number) {
    return { url: `/messages/${messageID}` };
  }

  @Get('/author')
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getChannelMessageAuthor(
    @Param('messageID', ParseIntPipe) messageID: number,
  ) {
    return { url: `/messages/${messageID}/author` };
  }

  @Get('/channel')
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getChannelMessageChannel(
    @Param('messageID', ParseIntPipe) messageID: number,
  ) {
    return { url: `/messages/${messageID}/channel` };
  }

  @Get('/data')
  @Redirect('/messages', HttpStatus.SEE_OTHER)
  async getChannelMessageData(
    @Param('messageID', ParseIntPipe) messageID: number,
  ) {
    return { url: `/messages/${messageID}/data` };
  }
}
