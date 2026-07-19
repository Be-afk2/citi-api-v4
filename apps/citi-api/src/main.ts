import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as serveStatic from 'serve-static';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());

  // Para los decoradores @Exclude() de class-transformer
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // ? Configuracion para convertir los DTO implicitamente
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const publicPath = path.join(__dirname, '..', '..', '..', 'public');
  app.use('/public', serveStatic(publicPath));
  await app.listen(process.env.APIPORT);
}
bootstrap();
