import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as path from 'path';
import * as serveStatic from 'serve-static';
var cors = require('cors')
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors())
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
	console.log('Ruta de archivos públicos:', publicPath);
	app.use('/public', serveStatic(publicPath));
  await app.listen(process.env.APIPORT );

}
bootstrap();
