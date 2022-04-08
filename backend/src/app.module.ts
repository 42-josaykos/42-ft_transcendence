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
  providers: [],
})
export class AppModule {}
