/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeoData } from 'apps/citi-back/src/entities/geoData.entity';
import { interaccion } from 'apps/citi-back/src/entities/interaccion.entity';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { Repository } from 'typeorm';
import { GetOneDto } from '../local/dto/GetOneDto.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(interaccion)
    private interaccionRepository: Repository<interaccion>,

    @InjectRepository(Local)
    private LocalRepository: Repository<Local>,

    @InjectRepository(GeoData)
    private GeoDataRepository: Repository<GeoData>,
  ) {}

  async GetLocaltop() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const query = await this.interaccionRepository
      .createQueryBuilder('interaccion')
      .leftJoinAndSelect('interaccion.local', 'local')
      .where('interaccion.updated_at >= :oneWeekAgo', { oneWeekAgo })
      .andWhere('local.id IS NOT NULL')
      .andWhere('interaccion.like = true')
      .orderBy('interaccion.updated_at', 'DESC')
      .select(['interaccion.id', 'local.id', 'local.nombre'])
      .getMany();
    const locales: { id: string; cantidad: number; nombre: string }[] = [];
    for (const item of query) {
      const existente = locales.find((e) => e.id === item.local.id);

      if (existente) {
        existente.cantidad += 1;
      } else {
        locales.push({
          id: item.local.id,
          cantidad: 1,
          nombre: item.local.nombre,
        });
      }
    }
    locales.sort((a, b) => b.cantidad - a.cantidad);

    return locales.slice(0, 5);
  }

  async GetEtiquetasTop() {
    const locales = await this.GetLocaltop();

    const etiquetas: { id: number; cantidad: number; nombre: string }[] = [];
    for (const item of locales) {
      const local = await this.LocalRepository.createQueryBuilder('local')
        .leftJoinAndSelect('local.etiquetas', 'Etiquetas')
        .where('local.id = :id', { id: item.id })
        .select(['local.id', 'Etiquetas.id', 'Etiquetas.nombre'])

        .getOne();
      for (const etiquetaItem of local.etiquetas) {
        const existente = etiquetas.find((e) => e.id === etiquetaItem.id);

        if (existente) {
          existente.cantidad += 1;
        } else {
          etiquetas.push({
            id: etiquetaItem.id,
            cantidad: 1,
            nombre: etiquetaItem.nombre,
          });
        }
      }
    }
    return etiquetas.slice(0, 5);
  }
  async GetMapaCalor(ciudad: GetOneDto, maxDistance: number = 20) {
    const data = await this.GeoDataRepository.createQueryBuilder('geo')
      .leftJoinAndSelect('geo.ciudad', 'ciudad')
      .where('geo.ciudad = :id', { id: ciudad.id })
      .select('geo.latitud', 'latitud')
      .addSelect('geo.longitud', 'longitud')
      .addSelect('geo.id', 'id')
      .addSelect('geo.ciudad', 'ciudad')
      .groupBy('geo.latitud')
      .addGroupBy('geo.longitud')
      .getRawMany();

    const items: { latitud: string; longitud: string; peso: number }[] = [];

    for (const item of data) {
      const elementos = await this.GeoDataRepository.createQueryBuilder('geo')
        .where('geo.id != :idelemento', { idelemento: item.id })
        .andWhere('geo.ciudad = :idciti', { idciti: item.ciudad })
        .andWhere(
          `
            ST_Distance_Sphere(
                point(geo.longitud, geo.latitud),
                point(:lon, :lat)
            ) <= :maxDistance
        `,
        )
        .addSelect('COUNT(*)', 'cantidad')
        .setParameters({
          lon: item.longitud,
          lat: item.latitud,
          maxDistance: maxDistance, // en metros
        })
        .groupBy('geo.latitud')
        .addGroupBy('geo.longitud')
        .getRawMany();
      items.push({
        latitud: item.latitud,
        longitud: item.longitud,
        peso: elementos.length * 0.1 + 0.1,
      });
    }

    return items;
  }
}
