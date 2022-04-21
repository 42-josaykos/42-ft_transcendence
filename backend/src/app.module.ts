import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ApiModule } from './api/api.module';
import { ChatGateway } from './gateway/chat.gateway';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';
import { StatusModule } from './status/status.module';
import * as Joi from 'joi';

const envSchema = Joi.object({
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POR: Joi.string(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      validationSchema: envSchema,
    }),
    PassportModule.register({ session: true }),
    ApiModule,
    StatusModule,
    UploadModule,
  ],
  controllers: [UploadController],
  providers: [ChatGateway],
})
export class AppModule {}
