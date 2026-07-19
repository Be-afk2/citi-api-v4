import { HomeService } from './home.service';
import { HomeController } from './home.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { GeoService } from '../geolocalizacion/geo.service';
import { LocalService } from '../local/local.service';
import { InteraccionService } from '../interacciones/interaccion.service';
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
