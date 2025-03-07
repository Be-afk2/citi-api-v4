/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PaguinadorDto } from '../etiqueta/dto/paguinadorDto.dto';
import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CrearEventoDto } from './dto/CrearEventoDto.dto';
import { GeoDataDto } from '../geolocalizacion/dto/geoData.dto';
import { GeoService } from '../geolocalizacion/geo.service';

@Injectable()
export class EventoService {


    constructor(
        @InjectRepository(Evento)
        private EventoRepository: Repository<Evento>,

        private readonly geoService: GeoService
    ) { }


    async GetEventos(paguinador : PaguinadorDto) {
        const [data, total] = await this.EventoRepository.findAndCount({
            skip: (paguinador.Paguina - 1) * paguinador.Cantidad,
            take: paguinador.Cantidad,
        });
        return {data, total};
    }

    async CrearEvento(data: CrearEventoDto) {
        
        const evento = await this.EventoRepository.create();
        evento.nombre = data.Nombre;
        evento.descripcion = data.Descripcion;
        evento.longitud = data.Longitud;
        evento.latitud = data.Latitud;
        evento.Organizador = data.Organizador;
        
        const GeoData = new GeoDataDto
        GeoData.Longitud = data.Longitud;
        GeoData.Latitud = data.Latitud;
        const geodata = await this.geoService.GetData(GeoData);

        return geodata
    }
}
