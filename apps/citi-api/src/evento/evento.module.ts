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
import { FotosEvento } from 'apps/citi-back/src/entities/fotosEvento.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InteraccionService } from '../interacciones/interaccion.service';
import { InteraccionModule } from '../interacciones/interaccion.module';
import { EtiquetaModule } from '../etiqueta/etiqueta.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: 'public/fotosEvento',
          filename: (req, file, cb) => {
            const fileName = file.originalname
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '')
              .replace(/[^\w\d]/g, '');
            const extension = extname(file.originalname);
            cb(null, `${fileName}-${Date.now()}${extension}`);
          },
        }),
      }),
    }),
    TypeOrmModule.forFeature([Evento, FotosEvento]),
    InteraccionModule,
    GeoModule,
    EtiquetaModule,
  ],
  controllers: [EventoController],
  providers: [EventoService, GeoService, InteraccionService],
  exports: [TypeOrmModule, EventoService],
})
export class EventoModule {}
