import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Setting up OpenAPI document
  const config = new DocumentBuilder()
    .setTitle('Transcendence')
    .setDescription('The Pong app API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  // Starting up API service
  const configService = app.get(ConfigService);
  const port = configService.get('BACKEND_PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);

  const authApp = await NestFactory.create(AuthModule);
  await authApp.listen(5000);
}
bootstrap();
