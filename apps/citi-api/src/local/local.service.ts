/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { PaguinadorDto } from '../etiqueta/dto/paguinadorDto.dto';
import { query } from 'express';
import { FiltroPaguinadorDto } from './dto/FiltroPaguinadorDto.dto';
import * as fs from 'fs';
import * as path from 'path';
import { EditarLocalDto } from './dto/EditarLocal.dto';
import { FavoritoDto } from './dto/FavoritoDto.dto';
import { skip } from 'rxjs';
@Injectable()
export class LocalService {
  constructor(
    @InjectRepository(Local)
    private LocalRepository: Repository<Local>,

    @InjectRepository(Etiquetas)
    private EtiquetasRepository: Repository<Etiquetas>,

    @InjectRepository(FotosLocal)
    private FotosLocalRepository: Repository<FotosLocal>,

    private geoService: GeoService,
  ) {}

  async CreateLocal(data: CreateLocalDto, necro: boolean = false) {
    const comprobacion = await this.ComprobarCrearLocal(data);

    if (!comprobacion) {
      throw new ConflictException('No se pudo crear el local');
    }

    const local = await this.LocalRepository.create();
    const GeoData = new GeoDataDto();
    GeoData.Longitud = data.longitud;
    GeoData.Latitud = data.latitud;

    const geodata = await this.geoService.GetData(GeoData);
    local.nombre = data.nombre;
    local.descripcion = data.descripcion;
    local.contacto = data.contacto;
    local.longitud = data.longitud;
    local.latitud = data.latitud;
    local.ciudad = geodata.ciudad;
    local.necro = necro;
    await local.save();
    return await this.getOne(local.id);
  }

  async CreateLocales(data: CreateLocalDto[], necro: boolean = false) {
    for (const item of data) {
      await this.CreateLocal(item, necro);
    }
    return { message: 'Locales creados' };
  }

  async ComprobarCrearLocal(data: CreateLocalDto) {
    const local = await this.LocalRepository.findOneBy({
      longitud: data.longitud,
      latitud: data.latitud,
    });
    if (local) {
      return false;
    }

    return true;
  }

  async SubirFoto(files, id) {
    const local = await this.LocalRepository.findOneBy({ id });

    if (!local) {
      throw new NotFoundException('Registro con este id no encontrado');
    }

    for (const item of files) {
      const newfoto = await this.FotosLocalRepository.create();
      newfoto.local = local;
      newfoto.path = item.path;
      await newfoto.save();
    }

    return await this.getOne(id);
  }

  async borrarFoto(idFoto: number) {
    const foto = await this.FotosLocalRepository.findOneBy({ id: idFoto });
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

  async getOne(id: string) {
    const local = await this.LocalRepository.createQueryBuilder('local')
      .where('local.id = :id', { id: id })
      .leftJoinAndSelect('local.fotos', 'FotosLocal')
      .leftJoinAndSelect('local.etiquetas', 'Etiquetas')
      .select([
        'local.id',
        'local.nombre',
        'local.descripcion',
        'local.contacto',
        'local.longitud',
        'local.latitud',
        'local.likes',
        'local.necro',
        'local.compartidos',
        'local.vistos',
        'FotosLocal.id',
        'FotosLocal.path',
        'Etiquetas.id',
        'Etiquetas.nombre',
      ])
      .getOne();

    if (!local) {
      throw new NotFoundException(`Local con ID ${id} no encontrado`);
    }

    return local;
  }

  async getOneMini(id: string) {
    const local = await this.LocalRepository.createQueryBuilder('local')
      .where('local.id = :id', { id: id })
      .leftJoinAndSelect('local.fotos', 'FotosLocal')
      .leftJoinAndSelect('local.etiquetas', 'Etiquetas')
      .select([
        'local.id',
        'local.nombre',
        'local.longitud',
        'local.latitud',
        'Etiquetas.id',
        'Etiquetas.nombre',
      ])
      .getOne();
    return local;
  }

  async EditarLocal(data: EditarLocalDto) {
    const local = await this.LocalRepository.findOneBy({ id: data.id });
    if (!local) {
      throw new NotFoundException('Registro con este id no encontrado');
    }

    if (data.nombre) {
      local.nombre = data.nombre;
    }
    if (data.descripcion) {
      local.descripcion = data.descripcion;
    }
    if (data.contacto) {
      local.contacto = data.contacto;
    }
    if (data.longitud && data.latitud) {
      const GeoData = new GeoDataDto();
      GeoData.Longitud = data.longitud;
      GeoData.Latitud = data.latitud;
      const geodata = await this.geoService.GetData(GeoData);
      local.ciudad = geodata.ciudad;
      local.latitud = data.latitud;
      local.longitud = data.longitud;
    }
    await local.save();
    return await this.getOne(local.id);
  }

  async getAll(user: User, admin: boolean, data: FiltroPaguinadorDto) {
    const Query = await this.LocalRepository.createQueryBuilder('local')
      .leftJoinAndSelect('local.etiquetas', 'Etiquetas')
      .leftJoinAndSelect('local.fotos', 'FotosLocal')
      .select([
        'local.id',
        'local.nombre',
        'local.longitud',
        'local.latitud',
        'Etiquetas.id',
        'Etiquetas.nombre',
        'FotosLocal.id',
        'FotosLocal.path',
      ]);

    if (data.Nombre) {
      Query.where('local.nombre LIKE :search', { search: `%${data.Nombre}%` });
    }
    if (admin && data.ciudad) {
      Query.andWhere('local.ciudad = :ciudad', { ciudad: data.ciudad });
    }
    if (admin && data.region) {
      Query.andWhere('local.region = :region', { region: data.region });
    }
    if (admin && data.pais) {
      Query.andWhere('local.pais = :pais', { pais: data.pais });
    }
    if (!admin) {
      Query.andWhere('local.ciudad = :ciudad', { ciudad: user.ciudad });
    }

    Query.skip((data.Paguina - 1) * data.Cantidad);
    Query.take(data.Cantidad);
    const [result, total] = await Query.getManyAndCount();
    // .getManyAndCount();
    return { data: result, total };
  }

  //rincon de las etiquetas

  async agregarEtiqv2(data: AsignarEtiquetaDto) {
    const [resultAgregar, resultEliminar] = await Promise.all([
      this.manejarEtiquetas(data, 'agregar'),
      this.manejarEtiquetas(data, 'eliminar'),
    ]);
    return { resultAgregar, resultEliminar };
  }

  private async manejarEtiquetas(
    data: AsignarEtiquetaDto,
    operacion: 'agregar' | 'eliminar',
  ) {
    const result = {
      newetiq: 0,
      oldetiq: 0,
      errorid: [],
      error: 0,
      message: '',
    };

    const local = await this.LocalRepository.findOne({
      where: { id: data.idLocal },
      relations: ['etiquetas'],
    });

    if (!local) {
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

      if (!local.etiquetas) {
        local.etiquetas = [];
      }

      const etiquetaExiste = local.etiquetas.some((e) => e.id === etiq.id);

      if (operacion === 'agregar') {
        if (!etiquetaExiste) {
          local.etiquetas.push(etiq);
          result.newetiq++;
        } else {
          result.oldetiq++;
        }
      } else {
        if (etiquetaExiste) {
          local.etiquetas = local.etiquetas.filter((e) => e.id !== etiq.id);
          result.oldetiq++;
        } else {
          result.newetiq++;
        }
      }
    }

    await local.save();
    return result;
  }

  async GuardarFavorito(data: FavoritoDto, user: User) {
    for (const item of data.FavoritoAgregar) {
      const LocalFavExiste = user.Favoritos.some((e) => e.id === item.id);
      if (LocalFavExiste) continue;
      const local = await this.LocalRepository.findOneBy({ id: item.id });
      if (!local) continue;
      user.Favoritos.push(local);
    }
    await user.save();

    return user;
  }

  async GetFavoritos(user) {
    var Locales = [];
    for (let item of user.Favoritos) {
      Locales.push(await this.getOneMini(item.id));
    }
    return Locales;
  }
}
