import { Local } from 'apps/citi-back/src/entities/local.entity';
import { GeoModule } from '../geolocalizacion/geo.module';
import { LocalController } from './local.controller';
import { LocalService } from './local.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { FotosLocal } from 'apps/citi-back/src/entities/fotoslocal.entity';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: 'public/fotosLocal',
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

    TypeOrmModule.forFeature([Local, FotosLocal, Etiquetas]),
    GeoModule,
  ],
  controllers: [LocalController],
  providers: [LocalService],
  exports: [TypeOrmModule, LocalService],
})
export class LocalModule {}
