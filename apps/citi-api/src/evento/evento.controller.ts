/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { EventoService } from './evento.service';
import { PaguinadorDto } from '../etiqueta/dto/paguinadorDto.dto';
import { CrearEventoDto } from './dto/CrearEventoDto.dto';
import { AsignarEtiqEventoDto } from './dto/AsignarEtiqEventoDto.dto';

@Controller('evento')
export class EventoController {

    constructor(
        private readonly eventoService: EventoService
    ) {}



    @Get()
    async GetEventos(@Query() data : PaguinadorDto) {
        return await this.eventoService.GetEventos(data);
    }


    @Post()
    async CrearEvento(@Body() data: CrearEventoDto) {
        return await this.eventoService.CrearEvento(data);
    }

    @Post('varias')
    async CrearEventos(@Body() data: CrearEventoDto[]) {
        return await this.eventoService.CrearEventos(data);
    }

  // rincon de las etiq


    @Put("etiq")
    async AsignarEtiqueta(@Query() data: AsignarEtiqEventoDto) {
        return await this.eventoService.AsignarEtiqueta(data);
    }


}
