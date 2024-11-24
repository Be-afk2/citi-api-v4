import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';

@Injectable()
export class UserService {
    async update(data: UpdateUserDto,user:User) {
        user.apellido = data.apellido ? data.apellido : user.apellido;
        user.apodo = data.apodo ? data.apodo : user.apodo;
        user.fechaNacimiento = data.fechaNacimiento ? data.fechaNacimiento : user.fechaNacimiento;
        user.mostrarContenidoMayor = data.mostrarContenidoMayor ? data.mostrarContenidoMayor : user.mostrarContenidoMayor;
        user.nombre = data.nombre ? data.nombre : user.nombre;

        const edad = new Date().getFullYear() - new Date(user.fechaNacimiento).getFullYear();
        
        user.mayorEdad = edad >= 18 ? true : false;
        await user.save()
        return  user;
    }


}
