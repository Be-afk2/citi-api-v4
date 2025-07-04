import { HomeModule } from './home/home.module';
import { EventoModule } from './evento/evento.module';
import { EtiquetaModule } from './etiqueta/etiqueta.module';
import { UserModule } from './user/user.module';
import { LocalModule } from './local/local.module';
import { GeoModule } from './geolocalizacion/geo.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Admin,
  Ciudad,
  Etiquetas,
  Evento,
  FotosEvento,
  FotosLocal,
  GeoData,
  Interacion,
  Local,
  Pais,
  Region,
  TipoUser,
  User,
} from './entities';

@Module({
  imports: [
    HomeModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // * Tablas
      entities: [
        Admin,
        Ciudad,
        Etiquetas,
        Evento,
        FotosEvento,
        FotosLocal,
        GeoData,
        Interacion,
        Local,
        Pais,
        Region,
        TipoUser,
        User,
      ],
      synchronize: false,
    }),

    AuthModule,
    GeoModule,
    UserModule,
    LocalModule,
    EtiquetaModule,
    EventoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
