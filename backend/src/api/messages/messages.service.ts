import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { FilterMessageDTO } from './dto/filter-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import Message from './entities/message.entity';
import User from 'src/api/users/entities/user.entity';
import Channel from 'src/api/channels/entities/channel.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}

  async getAllMessages(): Promise<Message[]> {
    const messages = await this.messagesRepository.find({
      order: { id: 'DESC' },
      relations: ['author', 'channel'],
    });
    return messages;
  }

  async getMessageByID(messageID: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
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
      .leftJoinAndSelect('messages.channel', 'channel')
      .orderBy('messages.id', 'DESC');

    if (filter.authorName)
      query.andWhere('author.username = :authorName', {
        authorName: filter.authorName,
      });
    if (filter.authorID)
      query.andWhere('author.id = :authorID', { authorID: filter.authorID });
    if (filter.channelName)
      query.andWhere('channel.name = :channelName', {
        channelName: filter.channelName,
      });
    if (filter.channelID)
      query.andWhere('channel.id = :channelID', {
        channelID: filter.channelID,
      });

    const messages = await query.getMany();
    if (!messages.length)
      throw new NotFoundException('Messages not found (filter incorrect)');
    return messages;
  }

  async createMessage(message: CreateMessageDTO): Promise<Message> {
    if ((await this.usersRepository.count(message.author)) === 0)
      throw new ForbiddenException(
        "Can't create message (author does not exists)",
      );
    if ((await this.channelsRepository.count(message.channel)) === 0)
      throw new ForbiddenException(
        "Can't create message (channel does not exists)",
      );

    const newMessage = this.messagesRepository.create(message);
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async updateMessage(
    messageID: number,
    updatedMessage: UpdateMessageDTO,
  ): Promise<Message> {
    try {
      const message = await this.getMessageByID(messageID);
      //Checking what is updated
      if (updatedMessage.author) message.author = updatedMessage.author;
      if (updatedMessage.channel) message.channel = updatedMessage.channel;
      if (updatedMessage.data) message.data = updatedMessage.data;
      await this.messagesRepository.save(message);
      return message;
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(messageID: number): Promise<void> {
    try {
      const message = await this.getMessageByID(messageID);
      await this.messagesRepository.remove(message);
    } catch (error) {
      throw error;
    }
  }
}
