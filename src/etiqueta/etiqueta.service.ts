/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PaguinadorDto } from './dto/paguinadorDto.dto';
import { Etiquetas } from 'src/entities/etiquetas.entiy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearEtiquetaDto } from './dto/createEtiquetaDto.dto';
import { UpdateEtiquetaDto } from './dto/UpdateEtiquetaDto.dto';

@Injectable()
export class EtiquetaService {
  constructor(
    @InjectRepository(Etiquetas)
    private EtiquetasRepository: Repository<Etiquetas>,
  ) {}

  async GetEtiquetas(paguinador: PaguinadorDto) {
    const [data, total] = await this.EtiquetasRepository.findAndCount({
      skip: (paguinador.Paguina - 1) * paguinador.Cantidad,
      take: paguinador.Cantidad,
    });
    return { data, total };
  }
  async CreateEtiqueta(data: CrearEtiquetaDto) {
    const result = {
      new: 0,
      old: 0,
    };
    for (const item of data.Etiquetas) {
      let etiqueta = await this.EtiquetasRepository.findOneBy({
        nombre: item.nombre,
      });
      if (!etiqueta) {
        result.new++;
        etiqueta = await this.EtiquetasRepository.create({
          nombre: item.nombre,
        }).save();
      } else {
        result.old++;
      }
    }
    return result;
  }

  async UpdateEtiqueta(data: UpdateEtiquetaDto) {
    const result = {
      update: 0,
      error: 0,
      errorIds: [],
    };
    for (const item of data.Etiquetas) {
      const etiqueta = await this.EtiquetasRepository.findOneBy({
        id: item.id,
      });
      if (etiqueta) {
        etiqueta.nombre = item.nombre;
        await etiqueta.save();
        result.update++;
      } else {
        result.error++;
        result.errorIds.push(item.id);
      }
    }
    return result;
  }
}
