import { TypeOrmModule } from '@nestjs/typeorm';
import { EtiquetaService } from './etiqueta.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';
import { EtiquetaController } from './etiqueta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Etiquetas])],
  controllers: [EtiquetaController],
  providers: [EtiquetaService],
})
export class EtiquetaModule {}
