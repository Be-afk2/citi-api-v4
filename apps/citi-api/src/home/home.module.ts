import { HomeService } from './home.service';
import { HomeController } from './home.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';
import { FotosLocal } from 'apps/citi-back/src/entities/fotoslocal.entity';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { GeoService } from '../geolocalizacion/geo.service';
import { Pais } from 'apps/citi-back/src/entities/pais.entity';
import { Ciudad } from 'apps/citi-back/src/entities/ciudad.entity';
import { Region } from 'apps/citi-back/src/entities/region.entity';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { LocalService } from '../local/local.service';
import { GeoData } from 'apps/citi-back/src/entities/geoData.entity';
import { UserService } from '../user/user.service';
import { FotosEvento } from 'apps/citi-back/src/entities/fotosEvento.entity';
import { InteraccionService } from '../interacciones/interaccion.service';
import { interaccion } from 'apps/citi-back/src/entities/interaccion.entity';
import { GeoModule } from '../geolocalizacion/geo.module';
import { LocalModule } from '../local/local.module';
import { EventoModule } from '../evento/evento.module';
import { InteraccionModule } from '../interacciones/interaccion.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    GeoModule,
    LocalModule,
    EventoModule,
    InteraccionModule,
    UserModule,
  ],
  controllers: [HomeController],
  providers: [HomeService, GeoService, LocalService, InteraccionService],
})
export class HomeModule {}
