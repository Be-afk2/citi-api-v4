import { TypeOrmModule } from '@nestjs/typeorm';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { InvitadoController } from './invitado.controller';
import { InvitadoService } from './invitado.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            TipoUser,
            Etiquetas
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1y' },
            }),
        })
    ],
    controllers: [InvitadoController,],
    providers: [InvitadoService, AuthService, JwtStrategy],
})
export class InvitadoModule { }
