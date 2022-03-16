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
import User from './entities/user.entity';
import Stats from 'src/api/stats/entities/stats.entity';

@Module({
  imports: [
    StatsModule,
    MessagesModule,
    TypeOrmModule.forFeature([User, Stats]),
  ],
  controllers: [UsersController, StatsRedirection, MessagesRedirection],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
