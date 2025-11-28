/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { interaccion } from 'apps/citi-back/src/entities/interaccion.entity';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(interaccion)
        private interaccionRepository: Repository<interaccion>,

        @InjectRepository(Local)
        private LocalRepository: Repository<Local>,
    ) { }

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
            .select([
                'interaccion.id',
                'local.id',
                'local.nombre',
            ])
            .getMany();
        const locales: { id: string; cantidad: number ;nombre : string}[] = [];
        for (const item of query) {
            const existente = locales.find(e => e.id === item.local.id);

            if (existente) {
                existente.cantidad += 1;
            } else {
                locales.push({
                    id: item.local.id,
                    cantidad: 1,
                    nombre: item.local.nombre
                });
            }
        }
        locales.sort((a, b) => b.cantidad - a.cantidad);

        return locales.slice(0, 5);;
    }

    async GetEtiquetasTop() {
        const locales = await this.GetLocaltop()

        var etiquetas: { id: number; cantidad: number ; nombre : string}[] = []
        for (let item of locales) {
            console.log(item)
            console.log(item.id)
            const local = await this.LocalRepository
                .createQueryBuilder("local")
                .leftJoinAndSelect('local.etiquetas', 'Etiquetas')
                .where('local.id = :id', { id: item.id })
                .select([
                    'local.id',
                    'Etiquetas.id',
                    'Etiquetas.nombre',
                ])
                .getOne()
            for (let etiquetaItem of local.etiquetas) {
                const existente = etiquetas.find(e => e.id === etiquetaItem.id);

                if (existente) {
                    existente.cantidad += 1;
                } else {
                    etiquetas.push({
                        id: etiquetaItem.id,
                        cantidad: 1,
                        nombre: etiquetaItem.nombre
                    }); 
                }
            }
        }
        return etiquetas.slice(0, 5)

    }
    async GetMapaCalor() {

        


    }


}
