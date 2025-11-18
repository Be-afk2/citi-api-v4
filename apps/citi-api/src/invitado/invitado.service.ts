/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { hash, compare } from 'bcrypt';

import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/CreateUser.dto';
import { AuthService } from '../auth/auth.service';

const UserInvitado = {
  nombre: 'Usuario',
  apellido: 'invitado',
  correo: 'invitado@gmail.com',
  pass: 'invitado',
};

@Injectable()
export class InvitadoService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,

    @InjectRepository(TipoUser)
    private TipoUserRepository: Repository<TipoUser>,

    private AuthService: AuthService,
  ) {}

  async GetInvitado() {
    let user = await this.UsersRepository.findOneBy({
      correo: UserInvitado.correo,
    });
    if (user) {
      return {
        // user: await this.AuthService.findUserById(user.id, false),
        user: user,
        token: await this.AuthService.get_token(user),
      };
    }

    user = await this.UsersRepository.create();
    user.nombre = UserInvitado.nombre;
    user.apellido = UserInvitado.apellido;
    user.correo = UserInvitado.correo;
    user.password = await hash(UserInvitado.pass, 10);
    user.tipoUser = await this.TipoUserRepository.findOneBy({ id: 3 });
    await user.save();

    return {
      user: await this.AuthService.findUserById(user.id, false),
      token: await this.AuthService.get_token(user),
    };
  }
}
