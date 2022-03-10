import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/api/users/entities/user.entity';
import { ChannelsController, MessageRedirection } from './channels.controller';
import { ChannelsService } from './channels.service';
import Channel from './entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User])],
  controllers: [ChannelsController, MessageRedirection],
  providers: [ChannelsService],
})
export class ChannelsModule {}
