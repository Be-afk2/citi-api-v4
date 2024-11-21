/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { CreateLocalDto } from './dto/CreateLocal.dto';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoService } from '../geolocalizacion/geo.service';
import { GeoDataDto } from '../geolocalizacion/dto/geoData.dto';

@Injectable()
export class LocalService {


    constructor(
        @InjectRepository(Local)
        private LocalRepository: Repository<Local>,

        private geoService: GeoService
        
    ) {}


    async CreateLocal(data: CreateLocalDto) {
        
        const comprobacion = await this.ComprobarCrearLocal(data);

        const local = await this.LocalRepository.create();
        const GeoData = new GeoDataDto
        GeoData.Longitud = data.longitud;
        GeoData.Latitud = data.latitud;


        const geodata = await this.geoService.GetData(GeoData);
        local.nombre = data.nombre;
        local.descripcion = data.descripcion;
        local.contacto = data.contacto;
        local.longitud = data.longitud;
        local.latitud = data.latitud;
        local.ciudad = geodata.ciudad;
        await local.save();
        return await this.GetOne(local.id);
    }

    async ComprobarCrearLocal(data: CreateLocalDto)  {
        
        var local = await this.LocalRepository.findOneBy({longitud: data.longitud, latitud: data.latitud });
        if(local) {
            return false;
        }


        return true
    }



    async GetOne(id: string) {
        const ciudad = await this.LocalRepository.createQueryBuilder("local")
        .where("local.id = :id", {id: id})
        .getOne();

        return ciudad
    }	
 }
