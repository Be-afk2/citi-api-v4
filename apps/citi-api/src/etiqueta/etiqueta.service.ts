/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PaguinadorDto } from './dto/paguinadorDto.dto';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable() 
export class EtiquetaService {

    constructor(
        @InjectRepository(Etiquetas)
        private PaisEtiquetas: Repository<Etiquetas>,



    ) {}

    async GetEtiquetas(paguinador: PaguinadorDto) {

        const [data, total] = await this.PaisEtiquetas.findAndCount({
            skip: (paguinador.Paguina - 1) * paguinador.Cantidad,
            take: paguinador.Cantidad,
        });
        return data;
    }


    
}
