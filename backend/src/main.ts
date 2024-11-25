import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Listen the port http://localhost:4000/');
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
    },
  });

  await app.listen(4000);
}
bootstrap();
