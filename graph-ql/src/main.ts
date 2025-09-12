import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { EntityNotFoundFilter } from './exception filters/entity-not-found/entity-not-found.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalFilters(new EntityNotFoundFilter());

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
