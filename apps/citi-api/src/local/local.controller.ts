/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { LocalService } from './local.service';
import { CreateLocalDto } from './dto/CreateLocal.dto';
import { FilesInterceptor } from '@nestjs/platform-express';




@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  async CreateLocal(@Body() data: CreateLocalDto) {
    return this.localService.CreateLocal(data);
  }

  @Put()
  @UseInterceptors(FilesInterceptor('archivo'))
  async actualizarFoto(@UploadedFiles() files: Express.Multer.File) {

    return await this.localService.SubirFoto(files)
  }
}
