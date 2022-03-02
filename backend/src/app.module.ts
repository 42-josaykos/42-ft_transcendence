import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './api/users/users.module';
import { MessagesModule } from './api/messages/messages.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path/posix';
import { MatchesModule } from './api/matches/matches.module';
import { StatsModule } from './api/stats/stats.module';
import { ChannelsModule } from './api/channels/channels.module';

const envSchema = Joi.object({
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POR: Joi.string(),
});

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../frontend', 'dist'),
    // }),
    ConfigModule.forRoot({
      envFilePath: '../.env',
      validationSchema: envSchema,
    }),
    DatabaseModule,
    UsersModule,
    StatsModule,
    MessagesModule,
    StatsModule,
    ChannelsModule,
    // MatchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
