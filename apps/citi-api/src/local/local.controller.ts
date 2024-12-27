/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { LocalService } from './local.service';
import { CreateLocalDto } from './dto/CreateLocal.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetOneDto } from './dto/GetOneDto.dto';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';




@Controller('local')
@UseGuards(JwtAuthGuard)
export class LocalController {
  constructor(private readonly localService: LocalService) { }



  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
  )
  @Post()
  async CreateLocal(@Body() data: CreateLocalDto) {
    return this.localService.CreateLocal(data);
  }


  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
  )
  @Put()
  @UseInterceptors(FilesInterceptor('archivo'))
  async actualizarFoto(@UploadedFiles() files: Express.Multer.File, @Body() data: GetOneDto) {

    return await this.localService.SubirFoto(files, data.id)
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
  async GetAll(@GetUser() user: User) {
    return await this.localService.getAll(user, false);
  }


  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
  )
  @Get('admin/all')
  async GetAlladmin(@GetUser() user: User) {
    return await this.localService.getAll(user, true);
  }
}
