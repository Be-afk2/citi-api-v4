/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { PaguinadorDto } from '../etiqueta/dto/paguinadorDto.dto';
import { CrearEventoDto } from './dto/CrearEventoDto.dto';
import { AsignarEtiqEventoDto } from './dto/AsignarEtiqEventoDto.dto';
import { GetOneDtoNumber } from './dto/GetOneDtoNumber.dto';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EditarEventoDto } from './dto/EditarEventoDto.dto';

@Controller('evento')
@UseGuards(JwtAuthGuard)
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario)
  @Get()
  async GetEventos(@Query() data: PaguinadorDto) {
    return await this.eventoService.GetEventos(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario)
  @Get('one')
  async GetEvento(@Query() data: GetOneDtoNumber) {
    return await this.eventoService.GetEvento(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Post()
  async CrearEvento(@Body() data: CrearEventoDto) {
    return await this.eventoService.CrearEvento(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Post('varias')
  async CrearEventos(@Body() data: CrearEventoDto[]) {
    return await this.eventoService.CrearEventos(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Put()
  @UseInterceptors(FilesInterceptor('archivo'))
  async actualizarFoto(
    @UploadedFiles() files: Express.Multer.File,
    @Body() data: GetOneDtoNumber,
  ) {
    return await this.eventoService.SubirFoto(files, data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Delete()
  async borrarFoto(@Query() data: GetOneDtoNumber) {
    return await this.eventoService.borrarFoto(data.id);
  }

  @Put('editar')
  async editarEvento(@Body() data: EditarEventoDto) {
    return await this.eventoService.editarEvento(data);
  }

  // rincon de las etiq

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Put('etiq')
  async AsignarEtiqueta(@Query() data: AsignarEtiqEventoDto) {
    return await this.eventoService.agregarEtiqv2(data);
  }

  //rincon de necro

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Post('necro')
  async CrearEventoNecro(@Body() data: CrearEventoDto) {
    return await this.eventoService.CrearEvento(data, true);
  }
}
