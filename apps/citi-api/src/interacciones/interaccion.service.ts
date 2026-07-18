/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { GetOneDto } from '../local/dto/GetOneDto.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { interaccion } from 'apps/citi-back/src/entities/interaccion.entity';
import { Repository } from 'typeorm';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { Evento } from 'apps/citi-back/src/entities/evento.entity';

@Injectable()
export class InteraccionService {
  constructor(
    @InjectRepository(interaccion)
    private interaccionRepository: Repository<interaccion>,

    @InjectRepository(Local)
    private LocalRepository: Repository<Local>,
    @InjectRepository(Evento)
    private EventoRepository: Repository<Evento>,
  ) {}
  async GetLocalInte(id: string) {
    const local = await this.LocalRepository.findOneBy({ id: id });

    if (!local) throw new NotFoundException(`Local con ID ${id} no encontrado`);

    return {
      likes: local.likes,
      compartidos: local.compartidos,
      vistos: local.vistos,
      reportes: local.reportes,
    };
  }

  //true : local
  // false : evento
  async GetInte(id, user: User, type: boolean) {
    let interaccion = await this.interaccionRepository
      .createQueryBuilder('interaccion')
      .where('interaccion.user = :user', { user: user.id })
      .andWhere(type ? 'interaccion.local = :id' : 'interaccion.evento = :id', {
        id: id,
      })
      .select([
        'interaccion.id',
        'interaccion.like',
        'interaccion.compartido',
        'interaccion.visto',
      ])
      .getOne();

    if (!interaccion) {
      interaccion = this.interaccionRepository.create();

      if (type) {
        interaccion.local = { id: id } as Local;
      } else {
        interaccion.evento = { id: id } as Evento;
      }

      interaccion.user = user;
      await this.interaccionRepository.save(interaccion);
    }

    return interaccion;
  }

  async switchInte(type: number, data: GetOneDto, user: User, isLocal) {
    let lugar;
    if (isLocal) {
      lugar = await this.LocalRepository.findOneBy({
        id: data.id,
      });
    } else {
      lugar = await this.EventoRepository.findOneBy({
        id: Number(data.id),
      });
    }
    if (!lugar)
      throw new NotFoundException(`Elemento con ID ${data.id} no encontrado`);
    const interaccion = await this.GetInte(data.id, user, isLocal);
    switch (type) {
      case 1:
        //like
        interaccion.like ? lugar.likes-- : lugar.likes++;
        interaccion.like = !interaccion.like;
        break;
      case 2:
        // compartidos, no tiene sentido quitar compartidos
        interaccion.compartido ? null : lugar.compartidos++;
        interaccion.compartido = true;
        break;
      case 3:
        // vistos, una vez visto no se puede "no ver"
        interaccion.visto ? null : lugar.vistos++;
        interaccion.visto = true;
        break;
    }

    await interaccion.save();
    await lugar.save();
    return {
      id: lugar.id,
      likes: lugar.likes,
      vistas: lugar.vistos,
      compartidos: lugar.compartidos,
      interaccion: interaccion,
    };
  }
}
