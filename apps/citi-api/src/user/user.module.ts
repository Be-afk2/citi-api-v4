import { User } from 'apps/citi-back/src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';
import { Etiquetas } from 'apps/citi-back/src/entities/etiquetas.entiy';

@Module({
  imports: [TypeOrmModule.forFeature([User, TipoUser, Etiquetas])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
