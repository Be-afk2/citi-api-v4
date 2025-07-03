import { HomeService } from './home.service';
import { HomeController } from './home.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etiquetas } from 'src/entities/etiquetas.entiy';
import { FotosLocal } from 'src/entities/fotoslocal.entity';
import { Local } from 'src/entities/local.entity';
import { GeoService } from '../geolocalizacion/geo.service';
import { Pais } from 'src/entities/pais.entity';
import { Ciudad } from 'src/entities/ciudad.entity';
import { Region } from 'src/entities/region.entity';
import { User } from 'src/entities/user.entity';
import { Evento } from 'src/entities/evento.entity';
import { LocalService } from '../local/local.service';
import { GeoData } from 'src/entities/geoData.entity';
import { UserService } from '../user/user.service';
import { FotosEvento } from 'src/entities/fotosEvento.entity';

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
