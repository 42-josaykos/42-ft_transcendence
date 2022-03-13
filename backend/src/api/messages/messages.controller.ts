import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { FilterMessageDTO } from './dto/filter-message.dto';
import { Utils } from 'src/utils/utils.provider';
import Message from './entities/message.entity';
import User from 'src/api/users/entities/user.entity';
import Channel from 'src/api/channels/entities/channel.entity';

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly utilsProvider: Utils,
  ) {}

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return await this.messagesService.getAllMessages();
  }

  @Get('search')
  async getMessagesByFilter(
    @Query() filter: FilterMessageDTO,
  ): Promise<Message[]> {
    return await this.messagesService.getMessagesByFilter(filter);
  }

  @Get(':messageID')
  async getMessageByID(
    @Param('messageID', ParseIntPipe) messageID: number,
  ): Promise<Message> {
    return await this.messagesService.getMessageByID(messageID);
  }

  @Get(':messageID/author')
  async getMessageAuthor(
    @Param('messageID', ParseIntPipe) messageID: number,
  ): Promise<User> {
    return await this.messagesService.getMessageAuthor(messageID);
  }

  @Get(':messageID/channel')
  async getMessageChannel(
    @Param('messageID', ParseIntPipe) messageID: number,
  ): Promise<Channel> {
    return await this.messagesService.getMessageChannel(messageID);
  }

  @Get(':messageID/data')
  async getMessageData(
    @Param('messageID', ParseIntPipe) messageID: number,
  ): Promise<string> {
    return await this.messagesService.getMessageData(messageID);
  }

  @Post()
  async createMessage(@Body() message: CreateMessageDTO): Promise<Message> {
    return await this.messagesService.createMessage(message);
  }

  @Delete(':messageID')
  async deleteMessage(@Param('messageID') messageID: number) {
    return await this.messagesService.deleteMessage(messageID);
  }
}
