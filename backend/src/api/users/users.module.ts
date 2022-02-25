import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsRedirection, UsersController } from './users.controller';
import { StatsModule } from '../stats/stats.module';
import { MessagesModule } from '../messages/messages.module';
import UsersService from './users.service';
import User from './entities/user.entity';
import Stats from '../stats/entities/stats.entity';
import Message from '../messages/entities/message.entity';

@Module({
  imports: [
    StatsModule,
    MessagesModule,
    TypeOrmModule.forFeature([User, Stats, Message]),
  ],
  controllers: [UsersController, StatsRedirection],
  providers: [UsersService],
})
export class UsersModule {}
