import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, ApiParam } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { getRepository } from 'typeorm';
import { TypeORMSession } from './auth/entities/session.entity';
import { TypeormStore } from 'connect-typeorm';
import { UploadModule } from './upload/upload.module';
import * as cookieParser from 'cookie-parser';
import { appendFile } from 'fs';

async function bootstrap() {
  const api = await NestFactory.create(AppModule);
  api.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    }),
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
  SwaggerModule.setup('/', api, document, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Definition',
  });

  // Starting up API service
  const configService = api.get(ConfigService);
  const port = configService.get('API_PORT') || 4001;

  // Cookie parser
  api.use(cookieParser());

  // Set session cookie
  const sessionRepo = getRepository(TypeORMSession);
  api.use(
    session({
      secret: 'oihgwoihreuewhvevrek', // We need to put this in an ENV
      cookie: {
        maxAge: 3600000,
      },
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
      }).connect(sessionRepo),
    }),
  );
  api.use(passport.initialize());
  api.use(passport.session());

  // API Module
  await api.listen(port, '0.0.0.0');
  console.log(`[APIModule] API is listening on: ${await api.getUrl()}`);

  // Auth Module
  // const authApp = await NestFactory.create(AuthModule);
  // await authApp.listen(5000);

  // Upload Module
  const uploadModulePort = 7002;
  const fileUpload = await NestFactory.create(UploadModule);
  await fileUpload.listen(uploadModulePort, '0.0.0.0');
  console.log(
    `[UploadModule] Upload service running on: ${await fileUpload.getUrl()}`,
  );
}
bootstrap();
