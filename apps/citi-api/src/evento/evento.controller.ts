/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query } from '@nestjs/common';
import { EventoService } from './evento.service';
import { PaguinadorDto } from '../etiqueta/dto/paguinadorDto.dto';

@Controller('evento')
export class EventoController {

    constructor(
        private readonly eventoService: EventoService
    ) {}



    @Get()
    async GetEventos(@Query() data : PaguinadorDto) {
        return await this.eventoService.GetEventos(data);
    }

}
