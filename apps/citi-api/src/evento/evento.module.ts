import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Evento
        ]),
    ],
    controllers: [EventoController,],
    providers: [EventoService,],
})
export class EventoModule { }
