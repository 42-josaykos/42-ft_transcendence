import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Utils } from 'src/utils/utils.provider';
import Message from './entities/message.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import User from 'src/api/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Channel])],
  controllers: [MessagesController],
  providers: [MessagesService, Utils],
  exports: [MessagesService]
})
export class MessagesModule {}
