import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource, DataSourceOptions } from 'typeorm';

async function runner() {
  console.log('Seed Runner Initialized');
  // * Crea una version de app para generar el seed
  const app = await NestFactory.createApplicationContext(AppModule);

  // * En esta seccion obtenemos la configuracion de la app
  console.log('NestJS application context created');
  console.log('Obtaining configurations');
  const connection = app.get(DataSource);
  // * Para hacer la conexión manual
  // const configService = app.get(ConfigService);
  // const settings: DataSourceOptions = {
  //   type: 'mysql',
  //   host: configService.get<string>('DB_HOST'),
  //   port: configService.get<number>('DB_PORT'),
  //   username: configService.get<string>('DB_USER'),
  //   password: configService.get<string>('DB_PASSWORD'),
  //   database: configService.get<string>('DB_NAME'),
  //   entities: [],
  // };
  await connection.synchronize();
  console.log('Done');

  // * Cerramos el script
  app.close();
  connection.destroy();
  process.exit(0);
}

runner();
