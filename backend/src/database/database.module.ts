import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from '../api/users/entities/user.entity';
import Stats from '../api/stats/entities/stats.entity';
import Message from '../api/messages/entities/message.entity';
import Channel from 'src/api/channels/entities/channel.entity';
import Match from 'src/api/matches/entities/matches.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, Stats, Match, Message, Channel],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
