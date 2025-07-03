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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Local,
      FotosLocal,
      Etiquetas,
      Pais,
      Ciudad,
      Region,
      User,
      Evento,
      GeoData,
      FotosEvento,
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService, GeoService, LocalService],
})
export class HomeModule {}
