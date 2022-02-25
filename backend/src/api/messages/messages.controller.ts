import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMessageDTO } from './dto/create-message.dto';
import Message from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getAllMessages(): Promise<Message[]> {
    return await this.messagesService.getAllMessages();
  }

  @Post()
  async postMessage(@Body() message: CreateMessageDTO): Promise<Message> {
    return await this.messagesService.postMessage(message);
  }
}
