/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PaguinadorDto } from '../etiqueta/dto/paguinadorDto.dto';
import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventoService {


    constructor(
        @InjectRepository(Evento)
        private EventoRepository: Repository<Evento>,
    ) { }


    async GetEventos(paguinador : PaguinadorDto) {
        const [data, total] = await this.EventoRepository.findAndCount({
            skip: (paguinador.Paguina - 1) * paguinador.Cantidad,
            take: paguinador.Cantidad,
        });
        return {data, total};
    }
}
