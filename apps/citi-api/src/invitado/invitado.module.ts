import { InvitadoController } from './invitado.controller';
import { InvitadoService } from './invitado.service';

/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserModule } from '../user/user.module';
import { EtiquetaModule } from '../etiqueta/etiqueta.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, EtiquetaModule, AuthModule],
  controllers: [InvitadoController],
  providers: [InvitadoService, AuthService, JwtStrategy],
})
export class InvitadoModule {}
