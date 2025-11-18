import { User } from 'apps/citi-back/src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';
import { EtiquetaModule } from '../etiqueta/etiqueta.module';

@Module({
  imports: [EtiquetaModule, TypeOrmModule.forFeature([User, TipoUser])],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
