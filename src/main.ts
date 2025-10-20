import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  activamos validación automática para todos los endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos no definidos en el DTO
      forbidNonWhitelisted: true, // lanza error si llegan campos extras
      transform: true, // convierte tipos automáticamente (por ejemplo, strings a numbers)
    }),
  );

  await app.listen(3000);
}
bootstrap();
