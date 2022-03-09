import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { FilterMessageDTO } from './dto/filter-message.dto';
import Message from './entities/message.entity';
import User from 'src/api/users/entities/user.entity';
import Channel from 'src/api/channels/entities/channel.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async getAllMessages(): Promise<Message[]> {
    const messages = await this.messagesRepository.find({
      order: { id: 'DESC' },
      relations: ['author', 'channel'],
    });
    return messages;
  }

  async getMessageByID(messageID: number): Promise<Message> {
    const message = this.messagesRepository.findOne({
      where: { id: messageID },
      relations: ['author', 'channel'],
    });
    if (!message)
      throw new NotFoundException('Message not found (id not correct)');
    return message;
  }

  async getMessageAuthor(messageID: number): Promise<User> {
    try {
      const message = await this.getMessageByID(messageID);
      return message.author;
    } catch (error) {
      throw error;
    }
  }

  async getMessageChannel(messageID: number): Promise<Channel> {
    try {
      const message = await this.getMessageByID(messageID);
      return message.channel;
    } catch (error) {
      throw error;
    }
  }

  async getMessageData(messageID: number): Promise<string> {
    try {
      const message = await this.getMessageByID(messageID);
      return message.data;
    } catch (error) {
      throw error;
    }
  }

  async getMessagesByFilter(filter: FilterMessageDTO): Promise<Message[]> {
    const query = this.messagesRepository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.author', 'author')
      .orderBy('messages.id', 'DESC');

    if (filter.authorName)
      query.andWhere('author.username = :author', {
        author: filter.authorName,
      });
    if (filter.authorID)
      query.andWhere('author.id = :authorID', { authorID: filter.authorID });
    if (filter.channelID)
      query.andWhere('messages.channel = :channel', {
        channel: filter.channelID,
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

  async deleteMessage(messageID: number): Promise<void> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageID },
      relations: ['author', 'channel'],
    });
    if (!message)
      throw new NotFoundException('Message not found (id incorrect)');
    else await this.messagesRepository.remove(message);
  }
}
