import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/api/users/entities/user.entity';
import { Utils } from 'src/utils/utils.provider';
import { ChannelsController, MessageRedirection } from './channels.controller';
import { ChannelsService } from './channels.service';
import Channel from './entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User])],
  controllers: [ChannelsController, MessageRedirection],
  providers: [ChannelsService, Utils],
  exports: [ChannelsService],
})
export class ChannelsModule {}
