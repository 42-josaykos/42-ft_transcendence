import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PassportModule } from '@nestjs/passport';
import { ApiModule } from './api/api.module';
import { DatabaseModule } from './database/database.module';
import { ChatGateway } from './gateway/chat.gateway';

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
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      validationSchema: envSchema,
    }),
    DatabaseModule,
    ApiModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
