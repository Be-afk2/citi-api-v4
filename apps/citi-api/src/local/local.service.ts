/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocalDto } from './dto/CreateLocal.dto';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoService } from '../geolocalizacion/geo.service';
import { GeoDataDto } from '../geolocalizacion/dto/geoData.dto';
import { FotosLocal } from 'apps/citi-back/src/entities/fotoslocal.entity';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { AsignarEtiquetaDto } from './dto/AsignarEtiquetaDto.dto';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';

@Injectable()
export class LocalService {


    constructor(
        @InjectRepository(Local)
        private LocalRepository: Repository<Local>,

        @InjectRepository(Etiquetas)
        private EtiquetasRepository: Repository<Etiquetas>,




        @InjectRepository(FotosLocal)
        private FotosLocalRepository: Repository<FotosLocal>,

        private geoService: GeoService

    ) { }


    async CreateLocal(data: CreateLocalDto) {

        console.log(data)
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
        return await this.getOne(local.id);
    }

    async CreateLocales(data: CreateLocalDto[]) {

        for(let item of data){
            await this.CreateLocal(item)
        }
        return {message: 'Locales creados'}
    }

    async ComprobarCrearLocal(data: CreateLocalDto) {

        var local = await this.LocalRepository.findOneBy({ longitud: data.longitud, latitud: data.latitud });
        if (local) {
            return false;
        }


        return true
    }



    async SubirFoto(files, id) {
        console.log(id)
        console.log(files)
        const local = await this.LocalRepository.findOneBy({ id })

        if (!local) {
            throw new NotFoundException('Registro con este id no encontrado');

        }

        for (let item of files) {
            const newfoto = await this.FotosLocalRepository.create()
            newfoto.local = local
            newfoto.path = item.path
            await newfoto.save()
        }

        return await this.getOne(id)
    }


    async getOne(id) {

        const local = await this.LocalRepository.createQueryBuilder("local")
            .where("local.id = :id", { id: id })
            .leftJoinAndSelect('local.fotos', 'FotosLocal')
            .select([
                'local.id',
                'local.nombre',
                'local.descripcion',
                'local.contacto',
                'local.longitud',
                'local.latitud',
                'local.likes',
                'local.compartidos',
                'local.vistos',
                'FotosLocal.id',
                'FotosLocal.path',

            ])
            .getOne();

        return local
    }


    async getAll(user: User, admin: boolean) {




    }


    




    //rincon de las etiquetas


    async AgregarEtiq(data: AsignarEtiquetaDto) {
        const result = {
            newetiq: 0,
            oldetiq: 0,
            errorid: [],
            error: 0,
            message: 'esto deberia estar vacio , si ves esto es porque se paso los filtros',

        }

        const local = await this.LocalRepository.findOne({
            where: { id: data.idLocal },
            relations: ['etiquetas'],  // Asegúrate de cargar la relación
        });
        if (!local) {
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
            if (!local.etiquetas) {
                local.etiquetas = [];
            }
            if (!local.etiquetas.some(e => e.id === etiq.id)) {
                local.etiquetas.push(etiq);
                result.newetiq++;
            } else {
                result.oldetiq++;
            }
        }

        await local.save()
        return result

    }


}
