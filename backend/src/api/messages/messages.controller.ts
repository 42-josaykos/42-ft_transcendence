import {
  Body,
  Controller,
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
import Message from './entities/message.entity';
import { FilterMessageDTO } from './dto/filter-message.dto';
import { Utils } from 'src/utils.provider';

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly utilsProvider: Utils,
  ) {}

  @Get()
  async getAllMessages(@Query() filter: FilterMessageDTO): Promise<Message[]> {
    if (!this.utilsProvider.isEmptyObject(filter))
      return await this.getMessagesByFilter(filter);
    return await this.messagesService.getAllMessages();
  }

  @Get()
  async getMessagesByFilter(filter: FilterMessageDTO) {
    return await this.messagesService.getMessagesByFilter(filter);
  }

  @Get(':id')
  async getMessageByID(@Param('id', ParseIntPipe) messageID: number) {
    return await this.messagesService.getMessageByID(messageID);
  }

  @Post()
  async createMessage(@Body() message: CreateMessageDTO): Promise<Message> {
    return await this.messagesService.createMessage(message);
  }
}
