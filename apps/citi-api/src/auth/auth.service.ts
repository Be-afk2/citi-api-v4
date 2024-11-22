/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { hash, compare } from 'bcrypt';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';
import { LoginDto } from './dto/LoginDto.dto';

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

        
        return {user : await this.findUserById(user.id, false), token : await this.get_token(user)}
    }

    async findUserById(id, bool) {

        // const user = await this.UsersRepository.findOne({
        //     where: { id: id },
        //     relations: ['tipoUser'] 
        //     .
        // });

        console.log("-------antes-----------")

        const user = await this.UsersRepository.createQueryBuilder("User")
        .leftJoinAndSelect('User.tipoUser', 'TipoUser')
        .where("User.id = :id", { id }) 
        .select([
            "User.id",
            "User.nombre",
            "User.apellido",
            "User.apodo",
            "User.correo",
            "User.fechaNacimiento",
            "User.mayorEdad",
            "User.mostrarContenidoMayor",
            "TipoUser.id",
            "TipoUser.tipo",
        ])
        .getOne();


        console.log("-------despies-----------")
        return user 
    }


    async get_token(user: User) {
        console.log(user)
        const payload = {
            id: user.id,
            nombre: user.nombre,
            tipo: user.tipoUser.id
        };
        const token = this.jwtService.sign(payload);
        return token;
    }


    async login(data : LoginDto){

        const this_user = await this.UsersRepository.findOne({
            where: { correo: data.Correo },
            relations: ['tipoUser'],
        });
        if(!this_user){
            throw new NotFoundException('Contraseña o correo no validos');
        }
        if (! await compare(data.Pass, this_user.password)) { throw new UnauthorizedException("Contraseña No Coincide"); }
        const token = await this.get_token(this_user)
        return {
            user: await this.findUserById(this_user.id,false),
            token,
        }

    }



    async logintoken(userid){
        return {
            user: await this.findUserById(userid,false),
        }
    }



}
