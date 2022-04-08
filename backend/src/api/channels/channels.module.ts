import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsController, MessageRedirection } from './channels.controller';
import { Utils } from 'src/utils/utils.provider';
import { ChannelsService } from './channels.service';
import User from 'src/api/users/entities/user.entity';
import BanedUser from 'src/api/users/entities/baned.user.entity';
import MutedUser from 'src/api/users/entities/muted.user.entity';
import Channel from './entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User, MutedUser, BanedUser])],
  controllers: [ChannelsController, MessageRedirection],
  providers: [ChannelsService, Utils],
  exports: [ChannelsService],
})
export class ChannelsModule {}
