import { TypeOrmModule } from '@nestjs/typeorm';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { InvitadoController } from './invitado.controller';
import { InvitadoService } from './invitado.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            TipoUser,
            Etiquetas
        ]),
    ],
    controllers: [InvitadoController,],
    providers: [InvitadoService,],
})
export class InvitadoModule { }
