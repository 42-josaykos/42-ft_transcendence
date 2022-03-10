import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { FilterMessageDTO } from './dto/filter-message.dto';
import { Utils } from 'src/utils.provider';
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

  @Get(':id')
  async getMessageByID(
    @Param('id', ParseIntPipe) messageID: number,
  ): Promise<Message> {
    return await this.messagesService.getMessageByID(messageID);
  }

  @Get(':id/author')
  async getMessageAuthor(
    @Param('id', ParseIntPipe) messageID: number,
  ): Promise<User> {
    return await this.messagesService.getMessageAuthor(messageID);
  }

  @Get(':id/channel')
  async getMessageChannel(
    @Param('id', ParseIntPipe) messageID: number,
  ): Promise<Channel> {
    return await this.messagesService.getMessageChannel(messageID);
  }

  @Get(':id/data')
  async getMessageData(
    @Param('id', ParseIntPipe) messageID: number,
  ): Promise<string> {
    return await this.messagesService.getMessageData(messageID);
  }

  @Post()
  async createMessage(@Body() message: CreateMessageDTO): Promise<Message> {
    return await this.messagesService.createMessage(message);
  }

  @Delete(':id')
  async deleteMessage(@Param('id') messageID: number) {
    return await this.messagesService.deleteMessage(messageID);
  }
}
