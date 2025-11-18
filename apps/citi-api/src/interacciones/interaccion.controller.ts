/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetOneDto } from '../local/dto/GetOneDto.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { InteraccionService } from './interaccion.service';
import { GetOneIntedto } from './dto/GetOneIntedto.dto';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { ParseInteractionPipe } from './pipes/interaction.pipe';

@Controller('interaccion')
@UseGuards(JwtAuthGuard)
export class InteraccionController {
  constructor(private readonly InteraccionService: InteraccionService) {}

  @Get()
  async GetInte(@Query() data: GetOneIntedto, @GetUser() user: User) {
    return await this.InteraccionService.GetInte(
      data.local ? data.idLocal : data.idEvento,
      user,
      data.local,
    );
  }

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario)
  @Put(':tipo/:accion')
  async interactuar(
    @Param('tipo') tipo: 'local' | 'evento',
    @Param('accion', ParseInteractionPipe) accionId,
    @Query() data: GetOneDto,
    @GetUser() user: User,
  ) {
    const isLocal = tipo === 'local';

    return await this.InteraccionService.switchInte(
      accionId,
      data,
      user,
      isLocal,
    );
  }
}
