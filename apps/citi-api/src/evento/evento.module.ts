import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [EventoController,],
    providers: [EventoService,],
})
export class EventoModule { }
