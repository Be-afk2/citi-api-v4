import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { LocalModule } from '../local/local.module';
import { EtiquetaModule } from '../etiqueta/etiqueta.module';
import { LocalService } from '../local/local.service';
import { GeoModule } from '../geolocalizacion/geo.module';
import { EventoModule } from '../evento/evento.module';
import { GeoService } from '../geolocalizacion/geo.service';
import { InteraccionModule } from '../interacciones/interaccion.module';
import { UserModule } from '../user/user.module';
import { InteraccionService } from '../interacciones/interaccion.service';

@Module({
    imports: [
    GeoModule,
    LocalModule,
    EventoModule,
    InteraccionModule,
    UserModule,
    ],
    controllers: [DashboardController,],
    providers: [DashboardService, GeoService, LocalService, InteraccionService ],
})
export class DashboardModule { }
