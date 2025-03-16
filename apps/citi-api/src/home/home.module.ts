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
            Evento
        ]),
    ],
    controllers: [HomeController,],
    providers: [HomeService, GeoService],
})
export class HomeModule { }
