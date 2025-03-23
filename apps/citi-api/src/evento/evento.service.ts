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
import { AsignarEtiqEventoDto } from './dto/AsignarEtiqEventoDto.dto';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';

@Injectable()
export class EventoService {


    constructor(
        @InjectRepository(Evento)
        private EventoRepository: Repository<Evento>,

        @InjectRepository(Etiquetas)
        private EtiquetasRepository: Repository<Etiquetas>,

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
        evento.fechaInicio = data.FechaInicio;
        evento.fechaFin = data.FechaFin;
        evento.activo = true;

        const GeoData = new GeoDataDto
        GeoData.Longitud = data.Longitud;
        GeoData.Latitud = data.Latitud;
        const geodata = await this.geoService.GetData(GeoData);

        evento.ciudad = geodata.ciudad;
        await evento.save()
        return geodata
    }

    async CrearEventos(data: CrearEventoDto[]) {
        for(let item of data){
            await this.CrearEvento(item)
        }
        return {message: 'Eventos creados'}
    }

    async AsignarEtiqueta(data: AsignarEtiqEventoDto) {

        const result = {
            newetiq: 0,
            oldetiq: 0,
            errorid: [],
            error: 0,
            message: '',

        }
        const evento = await this.EventoRepository.findOne({
            where: { id: data.idEvento },
            relations: ['etiquetas'],  // Asegúrate de cargar la relación
        });

        if (!evento) {
            result.error = 1
            result.message = 'Local no encontrado'
            return result
        }
        for (let item of data.Etiquetas) {

            const etiq = await this.EtiquetasRepository.findOneBy({ id: item.id })
            if (!etiq) {
                result.errorid.push(item.id)
                result.error++
                continue
            }
            if (!evento.etiquetas) {
                evento.etiquetas = [];
            }
            if (!evento.etiquetas.some(e => e.id === etiq.id)) {
                evento.etiquetas.push(etiq);
                result.newetiq++;
            } else {
                result.oldetiq++;
            }
        }

    }
}
