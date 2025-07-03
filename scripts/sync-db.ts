import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as db from 'src/entities';
import * as path from 'path';

async function runner() {
  console.log('Seed Runner Initialized');
  // * Crea una version de app para generar el seed
  const app = await NestFactory.createApplicationContext(AppModule);

  // * En esta seccion obtenemos la configuracion de la app
  console.log('NestJS application context created');
  console.log('Obtaining configurations');
  const configService = app.get(ConfigService);
  const srcFolder = path.join(__dirname, '..', 'src');

  // * En esta seccion extendemos las opciones de conexion
  const settings: DataSourceOptions = {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [
      db.Admin,
      db.Ciudad,
      db.Etiquetas,
      db.Evento,
      db.FotosEvento,
      db.FotosLocal,
      db.GeoData,
      db.Interacion,
      db.Local,
      db.Pais,
      db.Region,
      db.TipoUser,
      db.User,
    ],
  };

  // * Nos conectamos y aplicamos el seeder a la base de datos
  console.log('Database connection acquired');
  console.log('Running Seeders');
  const connection = new DataSource(settings);
  await connection.initialize();
  await connection.synchronize();
  console.log('Done');

  // * Cerramos el script
  app.close();
  connection.destroy();
  process.exit(0);
}

runner();
