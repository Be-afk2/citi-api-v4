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

    ) { }



    async GetLocal(){

        const local = await this.LocalRepository.find(
            // cosas que se pueden hacer con el find
        );

    }


    async homeLocal(data: GeoDataDto) {
        const lon = data.Longitud;
        const lat = data.Latitud;
        const maxDistance = 222;
    
        const local = await this.LocalRepository
            .createQueryBuilder("Local") 
            .select("Local.id", "id")
            .addSelect(
                `ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat))`,
                "distance"
            )
            .where(
                `ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat)) <= :maxDistance`
            )
            .setParameters({ lon, lat, maxDistance })
            .getRawMany();
    
        return local;
    }
    


}
