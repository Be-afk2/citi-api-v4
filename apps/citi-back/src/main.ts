import { NestFactory } from '@nestjs/core';
import { CitiBackModule } from './citi-back.module';

async function bootstrap() {
  const app = await NestFactory.create(CitiBackModule);
  await app.listen(process.env.BACKPORT );
}
bootstrap();
