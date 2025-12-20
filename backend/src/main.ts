import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips unknown props
    transform: true, // auto-transform payloads to DTO classes (types)
  }));

  app.enableCors({
    origin:true,
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials:true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Backend is running on http://localhost:3000');
}
bootstrap();
