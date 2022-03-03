import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { channel } from 'diagnostics_channel';
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
    const messages = await this.messagesRepository.find({
      order: { id: 'DESC' },
    });
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

  async getMessagesByFilter(filter: FilterMessageDTO): Promise<Message[]> {
    const query = this.messagesRepository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.author', 'author')
      .orderBy('messages.id', 'DESC');

    if (filter.author)
      query.andWhere('author.username = :author', { author: filter.author });
    if (filter.authorID)
      query.andWhere('author.id = :authorID', { authorID: filter.authorID });
    if (filter.channel)
      query.andWhere('messages.channel = :channel', {
        channel: filter.channel,
      });

    const messages = await query.getMany();
    if (!messages.length)
      throw new NotFoundException('Messages not found (filter incorrect)');
    return messages;
  }

  async createMessage(message: CreateMessageDTO): Promise<Message> {
    const newMessage = this.messagesRepository.create(message);
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }
}
