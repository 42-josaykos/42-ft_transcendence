import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDTO } from './dto/create-message.dto';
import Message from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async getAllMessages(): Promise<Message[]> {
    const messages = await this.messagesRepository.find();
    return messages;
  }

  async postMessage(message: CreateMessageDTO): Promise<Message> {
    const newMessage = this.messagesRepository.create(message);
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }
}
