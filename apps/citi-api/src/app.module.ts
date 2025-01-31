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
import { Ciudad } from 'apps/citi-back/src/entities/ciudad.entity';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';
import { EtiquetasEvento } from 'apps/citi-back/src/entities/etiquetasEvento.entity';
import { EtiquetasLocal } from 'apps/citi-back/src/entities/etiquetasLocal.entity';
import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { FotosEvento } from 'apps/citi-back/src/entities/fotosEvento.entity';
import { FotosLocal } from 'apps/citi-back/src/entities/fotoslocal.entity';
import { Interacion } from 'apps/citi-back/src/entities/interacion.entity';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { Pais } from 'apps/citi-back/src/entities/pais.entity';
import { Region } from 'apps/citi-back/src/entities/region.entity';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';
import { User } from 'apps/citi-back/src/entities/user.entity';

@Module({
  imports: [
        EventoModule, 
        EtiquetaModule, 

    ConfigModule.forRoot({ envFilePath: '.env' }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Ciudad,
        Etiquetas,
        EtiquetasEvento,
        EtiquetasLocal,
        Evento,
        FotosEvento,
        FotosLocal,
        Interacion,
        Local,
        Pais,
        Region,
        TipoUser,
        User
      ],
      synchronize: false,
    }),


    AuthModule,
    GeoModule,
    UserModule, 
    LocalModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
