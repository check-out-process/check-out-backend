import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './middleware/httpException.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  await app.listen(8080);
}
bootstrap();
