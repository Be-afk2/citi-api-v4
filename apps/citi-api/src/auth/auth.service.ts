/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { hash, compare } from 'bcrypt';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private UsersRepository: Repository<User>,

        @InjectRepository(TipoUser)
        private TipoUserRepository: Repository<TipoUser>,

        private jwtService: JwtService,
    ) { }

    
    async createUser(data: CreateUserDto) {

        var user = await this.UsersRepository.findOneBy({correo: data.correo});
        if (user) {
            throw new ConflictException('El correo ya existe');
        }

         user = await this.UsersRepository.create();
        user.nombre = data.nombre;
        user.apellido = data.apellido;
        user.correo = data.correo;
        user.password = await hash(data.password, 10)
        user.tipoUser = await this.TipoUserRepository.findOneBy({id: 2})
        await user.save();

        
        return {user : await this.findUserById(user.id, false), token : await this.createToken(user)}
    }

    async findUserById(id, bool) {

        const user = await this.UsersRepository.findOne({
            where: { id: id },
            relations: ['tipoUser'] 
        });
        return user
    }


    async createToken(user: User) {
        const payload = { id: user.id };	
        return this.jwtService.sign(payload);
    }
}
