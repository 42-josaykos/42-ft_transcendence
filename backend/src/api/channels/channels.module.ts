import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/api/users/entities/user.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import Channel from './entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
