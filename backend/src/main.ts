import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, ApiParam } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { appendFile } from 'fs';
import { getRepository } from 'typeorm';
import { TypeORMSession } from './auth/entities/session.entity';
import { TypeormStore } from 'connect-typeorm';

async function bootstrap() {
  const api = await NestFactory.create(AppModule);
  api.useGlobalPipes(
    new ValidationPipe({ transform: true, skipMissingProperties: true }),
  );
  api.enableCors({
    credentials: true,
  });

  // Setting up OpenAPI document
  const config = new DocumentBuilder()
    .setTitle('Transcendence')
    .setDescription('The Pong app API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(api, config);
  SwaggerModule.setup('/', api, document);

  // Starting up API service
  const configService = api.get(ConfigService);
  const port = configService.get('API_PORT') || 4000;

  // Set session cookie
  const sessionRepo = getRepository(TypeORMSession);
  api.use(
    session({
      secret: 'oihgwoihreuewhvevrek',
      cookie: {
        maxAge: 3600000,
      },
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepo),
    }),
  );
  api.use(passport.initialize());
  api.use(passport.session());

  await api.listen(port, '0.0.0.0');
  console.log(`API is listening on: ${await api.getUrl()}`);

  // const authApp = await NestFactory.create(AuthModule);
  // await authApp.listen(5000);
}
bootstrap();
