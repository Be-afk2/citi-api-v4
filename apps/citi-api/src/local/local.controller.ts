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
import { LocalService } from './local.service';
import { CreateLocalDto } from './dto/CreateLocal.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetOneDto } from './dto/GetOneDto.dto';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AsignarEtiquetaDto } from './dto/AsignarEtiquetaDto.dto';
import { FiltroPaguinadorDto } from './dto/FiltroPaguinadorDto.dto';
import { GetOneDtoNumber } from '../evento/dto/GetOneDtoNumber.dto';
import { EditarLocalDto } from './dto/EditarLocal.dto';
import { FavoritoDto } from './dto/FavoritoDto.dto';
import { InteraccionService } from '../interacciones/interaccion.service';

@Controller('local')
@UseGuards(JwtAuthGuard)
export class LocalController {
  constructor(private readonly localService: LocalService,
    private readonly InteraccionService: InteraccionService,
  ) { }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Post()
  async CreateLocal(@Body() data: CreateLocalDto) {
    return this.localService.CreateLocal(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Post('varias')
  async CreateLocales(@Body() data: CreateLocalDto[]) {
    return this.localService.CreateLocales(data);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Put()
  @UseInterceptors(FilesInterceptor('archivo'))
  async actualizarFoto(
    @UploadedFiles() files: Express.Multer.File,
    @Body() data: GetOneDto,
  ) {
    return await this.localService.SubirFoto(files, data.id);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Delete()
  async borrarFoto(@Query() data: GetOneDtoNumber) {
    return await this.localService.borrarFoto(data.id);
  }

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario, ValidRoles.Guest)
  @Get('one')
  async GetOne(@Query() data: GetOneDto, @GetUser() user: User) {
    const local = await this.localService.getOne(data.id);
    const dto: GetOneDto = { id: String(data.id) };

    await this.InteraccionService.switchInte(3, dto, user, true);
    return local

  }

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario, ValidRoles.Guest)
  @Get('all')
  async GetAll(@GetUser() user: User, @Query() data: FiltroPaguinadorDto) {
    return await this.localService.getAll(user, user.tipoUser.id == 1, data);
  }

  @Put('editar')
  @UseAuthUser(ValidRoles.SuperAdmin)
  async EditarLocal(@Body() data: EditarLocalDto) {
    return await this.localService.EditarLocal(data);
  }

  // rincon de las etiq

  @Put('etiq')
  @UseAuthUser(ValidRoles.SuperAdmin)
  async AgregarEtiq(@Body() data: AsignarEtiquetaDto) {
    return await this.localService.agregarEtiqv2(data);
  }

  // rincon de necro
  @UseAuthUser(ValidRoles.SuperAdmin)
  @Post('necro')
  async crearNecro(@Body() data: CreateLocalDto) {
    return await this.localService.CreateLocal(data, true);
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Post('necro/varias')
  async CreateNecroMulti(@Body() data: CreateLocalDto[]) {
    return this.localService.CreateLocales(data, true);
  }

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario)
  @Put('Favorito')
  async GuardarFavorito(@Body() data: FavoritoDto, @GetUser() user: User) {
    return await this.localService.GuardarFavorito(data, user);
  }

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario)
  @Get('Favorito')
  async GetFavoritos(@GetUser() user: User) {
    return await this.localService.GetFavoritos(user);
  }
}
