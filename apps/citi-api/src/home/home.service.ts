/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { GeoService } from '../geolocalizacion/geo.service';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciudad } from 'apps/citi-back/src/entities/ciudad.entity';
import { Pais } from 'apps/citi-back/src/entities/pais.entity';
import { Region } from 'apps/citi-back/src/entities/region.entity';
import { GeoDataDto } from '../geolocalizacion/dto/geoData.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';

@Injectable()
export class HomeService {




    constructor(
        private readonly geoService: GeoService,
        @InjectRepository(Local)
        private LocalRepository: Repository<Local>,
        @InjectRepository(Pais)
        private PaisRepository: Repository<Pais>,
        @InjectRepository(Ciudad)
        private CiudadRepository: Repository<Ciudad>,
        @InjectRepository(Region)
        private RegionRepository: Repository<Region>,
        @InjectRepository(Etiquetas)
        private EtiquetasRepository: Repository<Etiquetas>,

        @InjectRepository(Evento)
        private EventoRepository: Repository<Evento>,

    ) { }



    async GetLocal() {

        const local = await this.LocalRepository.find(
            // cosas que se pueden hacer con el find
        );

    }




    async homeLocal(data: GeoDataDto, user: User, necro: boolean = false, Preferencias: number[] = []) {

        var lon
        var lat

        if (data.Latitud != null || data.Longitud != null) {
            lon = data.Longitud;
            lat = data.Latitud;
        }
        else {
            const geo = await this.geoService.getGeoDataUser(user);
            lon = geo.Longitud;
            lat = geo.Latitud;
        }

        const maxDistance = data.Radio ? data.Radio : 400;

        var local = await this.LocalRepository
            .createQueryBuilder("Local")
            .leftJoinAndSelect('Local.ciudad', 'Ciudad')
            .leftJoinAndSelect('Local.etiquetas', 'Etiquetas')
            .where("Local.ciudad = :ciudad", { ciudad: user.ciudad.id })
            .andWhere(
                `ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat)) <= :maxDistance`
            )
        if (necro) {
            local.andWhere("Local.necro = :necro", { necro: necro })
        }
        if (Preferencias.length > 0) {
            local.andWhere("Etiquetas.id IN (:...preferencias)", { preferencias: Preferencias })
        }
        local.setParameters({ lon, lat, maxDistance })
            .orderBy("RAND()")
            .select([
                'Local.id',
                'Local.Nombre',
                'Local.likes',
                'Local.compartidos',
                'Local.vistos',
                'Etiquetas.id',
                'Etiquetas.nombre',

            ])
            .addSelect(
                `ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat))`,
                "distance"
            )


        return await local.getMany();
    }



    /*
    var local = await this.LocalRepository
      .createQueryBuilder("Local")
      .leftJoin('Local.ciudad', 'Ciudad')
      .leftJoin('Local.etiquetas', 'Etiquetas')
      .select([
          'Local.id',
          'Local.Nombre',
          'Local.likes',
          'Local.compartidos',
          'Local.vistos',
          'Etiquetas.id',
          'Etiquetas.nombre',
      ])
      .addSelect(`ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat))`, "distance")
      .where("Local.ciudad = :ciudad", { ciudad: user.ciudad.id })
      .andWhere(`ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat)) <= :maxDistance`)
      
    if(necro){
      local.andWhere("Local.necro = :necro", { necro: necro })
    }
    
    local.setParameters({ lon, lat, maxDistance })
      .orderBy("RAND()")
    
    const result = await local.getRawMany();
    return result;
    */


    async homeEvento(data: GeoDataDto, user: User, necro: boolean = false, Preferencias: [] = []) {
        const lon = data.Longitud;
        const lat = data.Latitud;
        const maxDistance = data.Radio ? data.Radio : 400;

        const Evento = await this.EventoRepository
            .createQueryBuilder("Evento")
            .leftJoin('Evento.ciudad', 'Ciudad')
            .leftJoin('Evento.etiquetas', 'Etiquetas')

        Evento.select("Evento.id", "id")
            .addSelect(
                `ST_Distance_Sphere(point(Evento.longitud, Evento.latitud), point(:lon, :lat))`,
                "distance"
            )
            .where("Evento.ciudad = :ciudad", { ciudad: user.ciudad.id })
            .andWhere(
                `ST_Distance_Sphere(point(Evento.longitud, Evento.latitud), point(:lon, :lat)) <= :maxDistance`
            )
        if (necro) {
            Evento.andWhere("Local.necro = :necro", { necro: necro })
        }
        if (Preferencias.length > 0) {
            Evento.andWhere("Etiquetas.id IN (:...preferencias)", { preferencias: Preferencias })
        }
        Evento.setParameters({ lon, lat, maxDistance })
            .orderBy("RAND()")
            .select([
                'Evento.id',
                'Evento.Nombre',
                'Evento.likes',
                'Evento.compartidos',
                'Evento.vistos',
                'Etiquetas.id',
                'Etiquetas.nombre',
            ])


        return await Evento.getMany();
    }


    //rincon necro

    async homeNecro(data: GeoDataDto, user: User) {
        const dataLocales = await this.homeLocal(data, user, true);
        const dataEventos = await this.homeEvento(data, user, true);

        return [dataLocales, dataEventos];
    }

    async GetPreferencias(user: User,data: GeoDataDto) {

        const preferencia = user.Preferencias.map((preferencia) => preferencia.id)
        return await this.homeLocal(data, user, false, preferencia);

    }
}
