/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { PaguinadorDto } from '../etiqueta/dto/paguinadorDto.dto';
import { FiltroDto } from './dto/FiltroDto.dto';
import { FiltroPaguinadorDto } from './dto/FiltroPaguinadorDto.dto';
import { GetOneDtoNumber } from '../evento/dto/GetOneDtoNumber.dto';




@Controller('local')
@UseGuards(JwtAuthGuard)
export class LocalController {
  constructor(private readonly localService: LocalService) { }



  @UseAuthUser(
    ValidRoles.SuperAdmin,
  )
  @Post()
  async CreateLocal(@Body() data: CreateLocalDto) {
    return this.localService.CreateLocal(data);
  }


  @UseAuthUser(
    ValidRoles.SuperAdmin,
  )
  @Post('varias')
  async CreateLocales(@Body() data: CreateLocalDto[]) {
    return this.localService.CreateLocales(data);
  }



  @UseAuthUser(
    ValidRoles.SuperAdmin,
  )
  @Put()
  @UseInterceptors(FilesInterceptor('archivo'))
  async actualizarFoto(@UploadedFiles() files: Express.Multer.File, @Body() data: GetOneDto) {

    return await this.localService.SubirFoto(files, data.id)
  }

  @UseAuthUser(
    ValidRoles.SuperAdmin,
  )
  @Delete()
  async borrarFoto(@Query() data: GetOneDtoNumber) {
    return await this.localService.borrarFoto(data.id)
  }

  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
  )
  @Get('one')
  async GetOne(@Query() data: GetOneDto) {
    return await this.localService.getOne(data.id);
  }



  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
  )
  @Get('all')
  async GetAll(@GetUser() user: User, @Query() data: FiltroPaguinadorDto) {
    return await this.localService.getAll(user, user.tipoUser.id == 1, data);
  }




  // rincon de las etiq


  @Put('etiq')
  async AgregarEtiq(@Body() data: AsignarEtiquetaDto) {
    return await this.localService.agregarEtiqv2(data);
  }



}
