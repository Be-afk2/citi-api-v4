import { Evento } from 'src/entities/evento.entity';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoModule } from '../geolocalizacion/geo.module';
import { GeoService } from '../geolocalizacion/geo.service';
import { Ciudad } from 'src/entities/ciudad.entity';
import { Pais } from 'src/entities/pais.entity';
import { Region } from 'src/entities/region.entity';
import { User } from 'src/entities/user.entity';
import { Etiquetas } from 'src/entities/etiquetas.entiy';
import { FotosEvento } from 'src/entities/fotosEvento.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GeoData } from 'src/entities/geoData.entity';

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
    TypeOrmModule.forFeature([
      Evento,
      Pais,
      Ciudad,
      Region,
      User,
      Etiquetas,
      FotosEvento,
      GeoData,
    ]),
  ],
  controllers: [EventoController],
  providers: [EventoService, GeoService],
})
export class EventoModule {}
