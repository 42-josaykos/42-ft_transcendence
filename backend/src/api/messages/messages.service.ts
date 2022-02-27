import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { FilterMessageDTO } from './dto/filter-message.dto';
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

  async getMessageByID(messageID: number) {
    const message = this.messagesRepository.findOne({
      where: { id: messageID },
    });
    if (!message)
      throw new NotFoundException('Message not found (id not correct)');
    return message;
  }

  async getMessageByFilter(filter: FilterMessageDTO): Promise<Message[]> {
    console.log('In MessageFilter');
    console.log('Filter: ', filter);
    const messages = this.messagesRepository.find({
      relations: ['author'],
      where: (user) => {
        user.where({ id: filter.authorID, username: filter.author });
      },
    });
    if (!messages)
      throw new NotFoundException('Messages not found (filter incorrect)');
    return messages;
  }

  async postMessage(message: CreateMessageDTO): Promise<Message> {
    const newMessage = this.messagesRepository.create(message);
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }
}
