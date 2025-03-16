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

        @InjectRepository(Evento)
        private EventoRepository: Repository<Evento>,

    ) { }



    async GetLocal() {

        const local = await this.LocalRepository.find(
            // cosas que se pueden hacer con el find
        );

    }


    async homeLocal(data: GeoDataDto, user: User) {
        const lon = data.Longitud;
        const lat = data.Latitud;
        const maxDistance = data.Radio ? data.Radio : 400;


        const local = await this.LocalRepository
            .createQueryBuilder("Local")
            .leftJoinAndSelect('Local.ciudad', 'Ciudad')

            .select("Local.id", "id")
            .addSelect(
                `ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat))`,
                "distance"
            )
            .where("Local.ciudad = :ciudad", { ciudad: user.ciudad.id })
            .andWhere(
                `ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat)) <= :maxDistance`
            )
            .setParameters({ lon, lat, maxDistance })
            .orderBy("RAND()")
            .getRawMany();

        return local;
    }



    async homeEvento(data: GeoDataDto, user: User) {
        const lon = data.Longitud;
        const lat = data.Latitud;
        const maxDistance = data.Radio ? data.Radio : 400;

        const Evento = await this.EventoRepository
            .createQueryBuilder("Evento")
            .leftJoinAndSelect('Evento.ciudad', 'Ciudad')

            .select("Evento.id", "id")
            .addSelect(
                `ST_Distance_Sphere(point(Evento.longitud, Evento.latitud), point(:lon, :lat))`,
                "distance"
            )
            .where("Evento.ciudad = :ciudad", { ciudad: user.ciudad.id })
            .andWhere(
                `ST_Distance_Sphere(point(Evento.longitud, Evento.latitud), point(:lon, :lat)) <= :maxDistance`
            )
            .setParameters({ lon, lat, maxDistance })
            .orderBy("RAND()")
            .getRawMany();



    }


}
