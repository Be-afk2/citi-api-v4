import { InteraccionService } from './interaccion.service';
import { InteraccionController } from './interaccion.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { interaccion } from 'apps/citi-back/src/entities/interaccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Local, Evento, interaccion])],
  controllers: [InteraccionController],
  providers: [InteraccionService],
  exports: [TypeOrmModule],
})
export class InteraccionModule {}
