import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoModule } from '../geolocalizacion/geo.module';
import { GeoService } from '../geolocalizacion/geo.service';
import { Ciudad } from 'apps/citi-back/src/entities/ciudad.entity';
import { Pais } from 'apps/citi-back/src/entities/pais.entity';
import { Region } from 'apps/citi-back/src/entities/region.entity';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Evento,
            Pais,
            Ciudad,
            Region,
            User,
            Etiquetas
        ]),
    ],
    controllers: [EventoController,],
    providers: [EventoService, GeoService],
})
export class EventoModule { }
