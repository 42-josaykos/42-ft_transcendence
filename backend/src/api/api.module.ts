import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TypeORMSession } from 'src/auth/entities/session.entity';
import { ChannelsModule } from './channels/channels.module';
import { MatchesModule } from './matches/matches.module';
import { MessagesModule } from './messages/messages.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';
import Channel from './channels/entities/channel.entity';
import Match from './matches/entities/matches.entity';
import Message from './messages/entities/message.entity';
import Stats from './stats/entities/stats.entity';
import User from './users/entities/user.entity';
import TimedUser from './users/entities/timed.user.entity';

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
        entities: [
          User,
          TimedUser,
          Stats,
          Match,
          Message,
          Channel,
          TypeORMSession,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    StatsModule,
    MatchesModule,
    MessagesModule,
    ChannelsModule,
    AuthModule,
  ],
  exports: [
    UsersModule,
    StatsModule,
    MatchesModule,
    MessagesModule,
    ChannelsModule,
    AuthModule,
  ],
})
export class ApiModule {}
