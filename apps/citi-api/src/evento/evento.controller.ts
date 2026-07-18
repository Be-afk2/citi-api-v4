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
import { InteraccionService } from '../interacciones/interaccion.service';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GetOneDto } from '../local/dto/GetOneDto.dto';

@Controller('evento')
@UseGuards(JwtAuthGuard)
export class EventoController {
  constructor(
    private readonly eventoService: EventoService,
    private readonly InteraccionService: InteraccionService,
  ) {}

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Get()
  async GetEventos(@Query() data: PaguinadorDto) {
    return await this.eventoService.GetEventos(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario, ValidRoles.Guest)
  @Get('one')
  async getEvento(@Query() query: GetOneDtoNumber, @GetUser() user: User) {
    const dto: GetOneDto = { id: String(query.id) };

    const evento = await this.eventoService.GetEvento(query);

    await this.InteraccionService.switchInte(3, dto, user, false);
    const interaccion = await this.InteraccionService.GetInte(
      query.id,
      user,
      false,
    );
    return { ...evento, interaccion };
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
