/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get } from '@nestjs/common';
import { EtiquetaService } from './etiqueta.service';
import { PaguinadorDto } from './dto/paguinadorDto.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('etiqueta' )
export class EtiquetaController {

    constructor(
        private EtiquetaService: EtiquetaService
    ){}



    @Get()
    async GetEtiqueta(@Body() data: PaguinadorDto,@GetUser() user: User) {
        return this.EtiquetaService.GetEtiquetas(data);
    }
}
