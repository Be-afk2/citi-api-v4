/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { EtiquetaService } from './etiqueta.service';
import { PaguinadorDto } from './dto/paguinadorDto.dto';
import { User } from 'src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { CrearEtiquetaDto } from './dto/createEtiquetaDto.dto';
import { GetOneDto } from '../local/dto/GetOneDto.dto';
import { UpdateEtiquetaDto } from './dto/UpdateEtiquetaDto.dto';

@Controller('etiqueta')
export class EtiquetaController {
  constructor(private EtiquetaService: EtiquetaService) {}

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario)
  @Get()
  async GetEtiqueta(@Query() data: PaguinadorDto, @GetUser() user: User) {
    return this.EtiquetaService.GetEtiquetas(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Post()
  async CreateEtiqueta(@Body() data: CrearEtiquetaDto) {
    return this.EtiquetaService.CreateEtiqueta(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Patch()
  async UpdateEtiqueta(@Body() data: UpdateEtiquetaDto) {
    return this.EtiquetaService.UpdateEtiqueta(data);
  }
}
