import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
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
  const port = configService.get('BACKEND_PORT') || 3000;

  // Set session cookie
  const sessionRepo = getRepository(TypeORMSession);
  api.use(
    session({
      secret: 'oihgwoihreuewhvevrek',
      cookie: {
        maxAge: 20000,
      },
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
        ttl: 20000,
      }).connect(sessionRepo),
    }),
  );
  api.use(passport.initialize());
  api.use(passport.session());

  await api.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await api.getUrl()}`);

  // const authApp = await NestFactory.create(AuthModule);
  // await authApp.listen(5000);
}
bootstrap();
