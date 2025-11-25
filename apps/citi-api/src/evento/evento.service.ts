/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { PaguinadorDto } from '../etiqueta/dto/paguinadorDto.dto';
import { Evento } from 'apps/citi-back/src/entities/evento.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CrearEventoDto } from './dto/CrearEventoDto.dto';
import { GeoDataDto } from '../geolocalizacion/dto/geoData.dto';
import { GeoService } from '../geolocalizacion/geo.service';
import { AsignarEtiqEventoDto } from './dto/AsignarEtiqEventoDto.dto';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';
import { GetOneDtoNumber } from './dto/GetOneDtoNumber.dto';
import { FotosEvento } from 'apps/citi-back/src/entities/fotosEvento.entity';
import * as fs from 'fs';
import * as path from 'path';
import { EditarEventoDto } from './dto/EditarEventoDto.dto';
import * as moment from 'moment';
@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private EventoRepository: Repository<Evento>,

    @InjectRepository(Etiquetas)
    private EtiquetasRepository: Repository<Etiquetas>,

    @InjectRepository(FotosEvento)
    private FotosEventoRepository: Repository<FotosEvento>,

    private readonly geoService: GeoService,
  ) { }

  async GetEventos(paguinador: PaguinadorDto) {
    const [data, total] = await this.EventoRepository.findAndCount({
      skip: (paguinador.Paguina - 1) * paguinador.Cantidad,
      take: paguinador.Cantidad,
      order: { id: 'DESC' },
      // Por si es rentable agregar la carga de imagenes desde acá
      // relations: { fotos: true },
    });
    return { data, total };
  }

  async GetEvento(data: GetOneDtoNumber) {
    const evento = await this.EventoRepository.createQueryBuilder('Evento')
      .leftJoinAndSelect('Evento.etiquetas', 'Etiquetas')
      .leftJoinAndSelect('Evento.ciudad', 'Ciudad')
      .leftJoinAndSelect('Evento.fotos', 'FotosEvento')
      .where('Evento.id = :id', { id: data.id })
      .select([
        'Evento.id',
        'Evento.nombre',
        'Evento.descripcion',
        'Evento.longitud',
        'Evento.latitud',
        'Evento.Organizador',
        'Evento.likes',
        'Evento.compartidos',
        'Evento.vistos',
        'Evento.reportes',
        'Evento.necro',
        'Evento.fechaInicio',
        'Evento.fechaFin',
        'FotosEvento.id',
        'FotosEvento.path',
        'Ciudad.id',
        'Ciudad.nombre',
      ])
      .getOne();


    if (!evento) {
      throw new NotFoundException(`Evento con ID ${data.id} no encontrado`);
    }

    return evento;
  }

  async CrearEvento(data: CrearEventoDto, Necro: boolean = false) {
    const evento = await this.EventoRepository.create();
    evento.nombre = data.Nombre;
    evento.descripcion = data.Descripcion;
    evento.longitud = data.Longitud;
    evento.latitud = data.Latitud;
    evento.Organizador = data.Organizador;
    evento.fechaInicio = data.FechaInicio;
    evento.fechaFin = data.FechaFin;
    evento.activo = true;
    evento.necro = Necro;

    const GeoData = new GeoDataDto();
    GeoData.Longitud = data.Longitud;
    GeoData.Latitud = data.Latitud;
    const geodata = await this.geoService.GetData(GeoData);

    evento.ciudad = geodata.ciudad;
    await evento.save();
    return evento;
  }

  async CrearEventos(data: CrearEventoDto[]) {
    const eventos = await Promise.all(
      data.map((item) => this.CrearEvento(item)),
    );
    return { message: 'Eventos creados', eventos };
  }

  async SubirFoto(files, data: GetOneDtoNumber) {
    const evento = await this.EventoRepository.findOneBy({ id: data.id });

    if (!evento) {
      throw new NotFoundException('Registro con este id no encontrado');
    }

    for (const item of files) {
      const newfoto = await this.FotosEventoRepository.create();
      newfoto.evento = evento;
      newfoto.path = item.path;
      await newfoto.save();
    }

    return await this.GetEvento(data);
  }

  async agregarEtiqv2(data: AsignarEtiqEventoDto) {
    const [resultAgregar, resultEliminar] = await Promise.all([
      this.manejarEtiquetas(data, 'agregar'),
      this.manejarEtiquetas(data, 'eliminar'),
    ]);
    return { resultAgregar, resultEliminar };
  }

  async borrarFoto(idFoto: number) {
    const foto = await this.FotosEventoRepository.findOneBy({ id: idFoto });
    if (!foto) {
      throw new NotFoundException('Registro con este id no encontrado');
    }
    const filePath = path.join(__dirname, '..', '..', '..', foto.path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    foto.remove();
    return { message: 'Foto eliminada' };
  }

  async editarEvento(data: EditarEventoDto) {
    const evento = await this.EventoRepository.findOneBy({ id: data.id });
    const fechaHoy = moment();
    if (!evento) {
      throw new NotFoundException('Registro con este id no encontrado');
    }
    if (data.Nombre) {
      evento.nombre = data.Nombre;
    }
    if (data.Descripcion) {
      evento.descripcion = data.Descripcion;
    }

    if (data.Latitud && data.Longitud) {
      evento.latitud = data.Latitud;
      evento.longitud = data.Longitud;
      const GeoData = new GeoDataDto();
      GeoData.Longitud = data.Longitud;
      GeoData.Latitud = data.Latitud;
      const geodata = await this.geoService.GetData(GeoData);
      evento.ciudad = geodata.ciudad;
    }
    if (data.Organizador) {
      evento.Organizador = data.Organizador;
    }
    if (data.FechaInicio) {
      evento.fechaInicio = data.FechaInicio;
      if (fechaHoy.isAfter(moment(data.FechaInicio))) {
        evento.activo = true;
      }
    }
    if (data.FechaFin) {
      evento.fechaFin = data.FechaFin;
      if (moment(data.FechaFin).isBefore(fechaHoy)) {
        evento.activo = false;
      }
    }
    await evento.save();
    return await this.GetEvento({ id: evento.id });
  }

  private async manejarEtiquetas(
    data: AsignarEtiqEventoDto,
    operacion: 'agregar' | 'eliminar',
  ) {
    const result = {
      newetiq: 0,
      oldetiq: 0,
      errorid: [],
      error: 0,
      message: '',
    };

    const evento = await this.EventoRepository.findOne({
      where: { id: data.idEvento },
      relations: ['etiquetas'],
    });

    if (!evento) {
      return {
        ...result,
        error: 1,
        message: 'Local no encontrado',
      };
    }

    const etiquetasOperacion =
      operacion === 'agregar' ? data.EtiquetaAgregar : data.EtiquetaEliminar;

    for (const item of etiquetasOperacion) {
      const etiq = await this.EtiquetasRepository.findOneBy({ id: item.id });

      if (!etiq) {
        result.errorid.push(item.id);
        result.error++;
        continue;
      }

      if (!evento.etiquetas) {
        evento.etiquetas = [];
      }

      const etiquetaExiste = evento.etiquetas.some((e) => e.id === etiq.id);

      if (operacion === 'agregar') {
        if (!etiquetaExiste) {
          evento.etiquetas.push(etiq);
          result.newetiq++;
        } else {
          result.oldetiq++;
        }
      } else {
        if (etiquetaExiste) {
          evento.etiquetas = evento.etiquetas.filter((e) => e.id !== etiq.id);
          result.oldetiq++;
        } else {
          result.newetiq++;
        }
      }
    }

    await evento.save();
    return result;
  }
}
