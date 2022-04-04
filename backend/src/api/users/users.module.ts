import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MessagesRedirection,
  StatsRedirection,
  UsersController,
} from './users.controller';
import { StatsModule } from 'src/api/stats/stats.module';
import { MessagesModule } from 'src/api/messages/messages.module';
import { UsersService } from './users.service';
import { Utils } from 'src/utils/utils.provider';
import User from './entities/user.entity';
import BanedUser from './entities/baned.user.entity';
import MutedUser from './entities/muted.user.entity';
import Stats from 'src/api/stats/entities/stats.entity';

@Module({
  imports: [
    StatsModule,
    MessagesModule,
    TypeOrmModule.forFeature([User, MutedUser, BanedUser, Stats]),
  ],
  controllers: [UsersController, StatsRedirection, MessagesRedirection],
  providers: [UsersService, Utils],
  exports: [UsersService],
})
export class UsersModule {}
