import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { ChannelsModule } from './channels/channels.module';
import { MatchesModule } from './matches/matches.module';
import { MessagesModule } from './messages/messages.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    StatsModule,
    MatchesModule,
    MessagesModule,
    ChannelsModule,
    AuthModule,
  ],
  exports: [
    DatabaseModule,
    UsersModule,
    StatsModule,
    MatchesModule,
    MessagesModule,
    ChannelsModule,
    AuthModule,
  ],
})
export class ApiModule {}
