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
import { FotosLocal } from 'apps/citi-back/src/entities/fotoslocal.entity';
import { FotosEvento } from 'apps/citi-back/src/entities/fotosEvento.entity';
import { interaccion } from 'apps/citi-back/src/entities/interaccion.entity';
import { InteraccionService } from '../interacciones/interaccion.service';
@Injectable()
export class HomeService {
  constructor(
    private readonly geoService: GeoService,
    private readonly InteraccionService: InteraccionService,
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

    @InjectRepository(interaccion)
    private interaccionRepository: Repository<interaccion>,

    @InjectRepository(Evento)
    private EventoRepository: Repository<Evento>,
  ) { }

  async GetLocal() {
    const local = await this.LocalRepository
      .find
      // cosas que se pueden hacer con el find
      ();
  }

  async homeLocal(
    data: GeoDataDto,
    user: User,
    necro: boolean = false,
    Preferencias: number[] = [],
  ) {
    let lon;
    let lat;

    if (data.Latitud != null || data.Longitud != null) {
      lon = data.Longitud;
      lat = data.Latitud;
    } else {
      const geo = await this.geoService.getGeoDataUser(user);
      lon = geo.Longitud;
      lat = geo.Latitud;
    }
    const maxDistance = data.Radio ? data.Radio : 400;

    const local = this.LocalRepository.createQueryBuilder('Local')
      .leftJoinAndSelect('Local.ciudad', 'Ciudad')
      .leftJoinAndSelect('Local.etiquetas', 'Etiquetas')
      .leftJoinAndSelect(
        'Local.interaccion',
        'Interaccion',
        'Interaccion.user = :user',
        { user: user.id },
      );

    if (user.tipoUser.id != 3) {
      local.where('Local.ciudad = :ciudad', { ciudad: user.ciudad.id });
    }
    local.andWhere(
      `ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat)) <= :maxDistance`,
    );
    local.andWhere('Local.necro = :necro', { necro: necro });
    if (Preferencias.length > 0) {
      local.andWhere('Etiquetas.id IN (:...preferencias)', {
        preferencias: Preferencias,
      });
    }
    local
      .setParameters({ lon, lat, maxDistance })
      .orderBy('RAND()')
      .select([
        'Local.id',
        'Local.Nombre',
        'Local.likes',
        'Local.compartidos',
        'Local.vistos',
        'Local.latitud',
        'Local.longitud',
        'Etiquetas.id',
        'Etiquetas.nombre',
        'Interaccion.like',
        'Interaccion.visto',
        'Interaccion.compartido',
      ])
      .addSelect(
        `ST_Distance_Sphere(point(Local.longitud, Local.latitud), point(:lon, :lat))`,
        'distance',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select('fotos.path')
          .from(FotosLocal, 'fotos')
          .where('fotos.localId = Local.id')
          .orderBy('RAND()')
          .limit(1);
      }, 'fotoAleatoria');

    const rawResults = await local.getRawMany();
    const localesMap = new Map();
    rawResults.forEach((item) => {
      if (!localesMap.has(item.Local_id)) {
        localesMap.set(item.Local_id, {
          id: item.Local_id,
          nombre: item.Nombre,
          likes: item.Local_likes,
          compartidos: item.Local_compartidos,
          latitud: item.Local_latitud,
          longitud: item.Local_longitud,
          vistos: item.Local_vistos,
          foto: item.fotoAleatoria,
          etiquetas: [],
          interaccion: {
            like: item.Interaccion_like
              ? Boolean(item.Interaccion_like)
              : false,
            compartido: item.Interaccion_compartido
              ? Boolean(item.Interaccion_compartido)
              : false,
            visto: item.Interaccion_visto
              ? Boolean(item.Interaccion_visto)
              : false,
          },
        });
      }

      // Si hay etiqueta en esta fila, la agrega
      if (item.Etiquetas_id) {
        const etiquetas = localesMap.get(item.Local_id).etiquetas;
        // Evitar duplicados
        if (!etiquetas.find((e) => e.id === item.Etiquetas_id)) {
          etiquetas.push({
            id: item.Etiquetas_id,
            nombre: item.Etiquetas_nombre,
          });
        }
      }
    });

    return Array.from(localesMap.values());
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

  async homeEvento(
    data: GeoDataDto,
    user: User,
    necro: boolean = false,
    Preferencias: [] = [],
  ) {
    const lon = data.Longitud;
    const lat = data.Latitud;
    const maxDistance = data.Radio ? data.Radio : 400;

    const Evento = await this.EventoRepository.createQueryBuilder('Evento')
      .leftJoin('Evento.ciudad', 'Ciudad')
      .leftJoin('Evento.etiquetas', 'Etiquetas')
      .leftJoinAndSelect(
        'Evento.interaccion',
        'Interaccion',
        'Interaccion.user = :user AND Interaccion.evento = Evento.id',
        { user: user.id },
      );

    Evento.select('Evento.id', 'id').addSelect(
      `ST_Distance_Sphere(point(Evento.longitud, Evento.latitud), point(:lon, :lat))`,
      'distance',
    );
    if (user.tipoUser.id != 3) {
      Evento.where('Evento.ciudad = :ciudad', { ciudad: user.ciudad.id });
    }
    Evento.andWhere(
      `ST_Distance_Sphere(point(Evento.longitud, Evento.latitud), point(:lon, :lat)) <= :maxDistance`,
    ).andWhere('Evento.activo = TRUE');
    Evento.andWhere('Evento.necro = :necro', { necro: necro });
    if (Preferencias.length > 0) {
      Evento.andWhere('Etiquetas.id IN (:...preferencias)', {
        preferencias: Preferencias,
      });
    }
    Evento.setParameters({ lon, lat, maxDistance })
      .orderBy('RAND()')
      .select([
        'Evento.id',
        'Evento.Nombre',
        'Evento.likes',
        'Evento.compartidos',
        'Evento.vistos',
        'Evento.longitud',
        'Evento.latitud',
        'Etiquetas.id',
        'Etiquetas.nombre',
        'Interaccion.like',
        'Interaccion.visto',
        'Interaccion.compartido',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('fotos.path')
          .from(FotosEvento, 'fotos')
          .where('fotos.eventoId = Evento.id')
          .orderBy('RAND()')
          .limit(1);
      }, 'fotoAleatoria');

    const rawResults = await Evento.getRawMany();
    const localesMap = new Map();
    rawResults.forEach((item) => {
      if (!localesMap.has(item.Evento_id)) {
        localesMap.set(item.Evento_id, {
          id: item.Evento_id,
          nombre: item.Nombre,
          likes: item.Evento_likes,
          compartidos: item.Evento_compartidos,
          vistos: item.Evento_vistos,
          longitud: item.Evento_longitud,
          latitud: item.Evento_latitud,
          foto: item.fotoAleatoria,
          etiquetas: [],
        });
      }

      // Si hay etiqueta en esta fila, la agrega
      if (item.Etiquetas_id) {
        const etiquetas = localesMap.get(item.Evento_id).etiquetas;
        // Evitar duplicados
        if (!etiquetas.find((e) => e.id === item.Etiquetas_id)) {
          etiquetas.push({
            id: item.Etiquetas_id,
            nombre: item.Etiquetas_nombre,
          });
        }
      }
    });

    return Array.from(localesMap.values());
  }

  //rincon necro

  async homeNecro(data: GeoDataDto, user: User) {
    const dataLocales = await this.homeLocal(data, user, true);
    const dataEventos = await this.homeEvento(data, user, true);

    return { dataLocales, dataEventos };
  }

  async GetPreferencias(user: User, data: GeoDataDto) {
    const preferencia = user.Preferencias.map((preferencia) => preferencia.id);
    return await this.homeLocal(data, user, false, preferencia);
  }
}
