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
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

const envSchema = Joi.object({
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POR: Joi.string(),
});

// Choose environment by setting $ENVIRONMENT to 'DEVELOPMENT' or 'PRODUDCTION'
let envFilePath = '.env.development';
const mode = process.env.ENVIRONMENT ? process.env.ENVIRONMENT : 'DEVELOPMENT';
console.log(`Running in ${mode}`);
if (process.env.ENVIRONMENT === 'PRODUCTION') {
  envFilePath = '.env.production';
}

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../frontend', 'dist'),
    // }),
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      validationSchema: envSchema,
    }),
    DatabaseModule,
    UsersModule,
    StatsModule,
    MatchesModule,
    MessagesModule,
    ChannelsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
