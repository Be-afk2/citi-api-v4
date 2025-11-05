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


const tiposUserCrear = [{
    id: 1,
    tipo: "Admin",
},
{
    id: 2,
    tipo: "App",
},
{
    id: 3,
    tipo: "Invitado",
}]


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
        await this.comprobarTipo();

        var user = await this.UsersRepository.findOneBy({ correo: data.correo });
        if (user) {
            throw new ConflictException('El correo ya existe');
        }

        user = await this.UsersRepository.create();
        user.nombre = data.nombre;
        user.apellido = data.apellido;
        user.correo = data.correo;
        user.password = await hash(data.password, 10)
        user.tipoUser = await this.TipoUserRepository.findOneBy({ id: 2 })
        await user.save();

        return { user: await this.findUserById(user.id, false), token: await this.get_token(user) }
    }

    async findUserById(id, bool) {

        // const user = await this.UsersRepository.findOne({
        //     where: { id: id },
        //     relations: ['tipoUser'] 
        //     .
        // });


        const user = await this.UsersRepository.createQueryBuilder("User")
            .leftJoinAndSelect('User.tipoUser', 'TipoUser')
            .leftJoinAndSelect('User.ciudad', 'Ciudad')
            .leftJoinAndSelect('User.Preferencias', 'Etiquetas')
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
                "Ciudad.id",
                "Ciudad.nombre",
                "Etiquetas.id",
                "Etiquetas.nombre",
            ])
            .getOne();

        return user
    }


    async get_token(user: User) {
        const payload = {
            id: user.id,
            nombre: user.nombre,
            tipo: user.tipoUser.id
        };
        const token = this.jwtService.sign(payload);
        return token;
    }


    async login(data: LoginDto) {

        const this_user = await this.UsersRepository.findOne({
            where: { correo: data.Correo },
            relations: ['tipoUser'],
        });
        if (!this_user) {
            throw new NotFoundException('Contraseña o correo no validos');
        }
        if (! await compare(data.Pass, this_user.password)) { throw new UnauthorizedException("Contraseña No Coincide"); }
        const token = await this.get_token(this_user)
        return {
            user: await this.findUserById(this_user.id, false),
            token,
        }

    }



    async logintoken(userid) {
        return {
            user: await this.findUserById(userid, false),
        }
    }



    //--------------------------------

    async createType(type: { id: number; tipo: string }) {
        const existingType = await this.TipoUserRepository.findOneBy({ id: type.id });

        if (existingType) {
            return {
                class: "UserType",
                type: type.tipo,
                status: "OK",
            };
        }

        const newType = this.TipoUserRepository.create({
            id: type.id,
            tipo: type.tipo,
        });

        await this.TipoUserRepository.save(newType);

        return {
            class: "UserType",
            type: type.tipo,
            status: "CREATE OK",
        };
    }

    async comprobarTipo() {
        const tipos = await this.TipoUserRepository.find();
        if (tipos.length == 0) {
            const tipo = [{
                id: 1,
                tipo: "Admin"
            },
            {
                id: 2,
                tipo: "App"
            }]
            try {
                await this.TipoUserRepository.save(tipo);
                return { class: "UserType", status: "CREATE OK" }
            }
            catch (error) {
                return { class: "UserType", status: "CREATE FAILED", error }
            }
        }
        return { class: "UserType", status: "OK" }
    }

    async comprobarTipoV2() {
        var status = []
        for (let item of tiposUserCrear) {

            try {
                status.push(await this.createType(item))
            }
            catch (error) {
                status.push({
                    class: "UserType", type: item.tipo, status: "CREATE FAILED", error
                })
            }
        }
        return {type: "comprobarTipoV2", status}
    }





}
