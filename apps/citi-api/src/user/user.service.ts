import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { PreferenciasUser } from './dto/PreferenciaDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {


    constructor(
        @InjectRepository(Etiquetas)
        private EtiquetasRepository: Repository<Etiquetas>,
    ) { }

    async update(data: UpdateUserDto, user: User) {
        user.apellido = data.apellido ? data.apellido : user.apellido;
        user.apodo = data.apodo ? data.apodo : user.apodo;
        user.fechaNacimiento = data.fechaNacimiento ? data.fechaNacimiento : user.fechaNacimiento;
        user.mostrarContenidoMayor = data.mostrarContenidoMayor ? data.mostrarContenidoMayor : user.mostrarContenidoMayor;
        user.nombre = data.nombre ? data.nombre : user.nombre;

        const edad = new Date().getFullYear() - new Date(user.fechaNacimiento).getFullYear();

        user.mayorEdad = edad >= 18 ? true : false;
        await user.save()
        return user;
    }


    async updatePreferencia(data: PreferenciasUser, user: User) {

        const result = {
            newetiq: 0,
            oldetiq: 0,
            errorid: [],
            error: 0,

        }
        for (let etiq of data.Etiquetas) {

            const etiqueta = await this.EtiquetasRepository.findOneBy({ id: etiq.id });

            if (!etiqueta) {
                result.errorid.push(etiq.id);
                result.error++;
                continue;
            }

            if (!user.Preferencias.some(e => e.id === etiqueta.id)) {
                user.Preferencias.push(etiqueta);
                result.newetiq++;
            }
            else {
                result.oldetiq++;
            }



        }
        await user.save()
        return result;
    }

    async getPreferences(user: User) {
        return user.Preferencias;
    }



    //
    async test(user: User | null){
            return user
    }
}