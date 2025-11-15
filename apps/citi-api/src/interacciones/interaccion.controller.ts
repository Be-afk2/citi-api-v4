/*
https://docs.nestjs.com/controllers#controllers
*/

import { BadRequestException, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetOneDto } from '../local/dto/GetOneDto.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { InteraccionService } from './interaccion.service';
import { GetOneDtoNumber } from '../evento/dto/GetOneDtoNumber.dto';
import { GetOneIntedto } from './dto/GetOneIntedto.dto';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';

@Controller("interaccion")
@UseGuards(JwtAuthGuard)
export class InteraccionController {
    constructor(private readonly InteraccionService: InteraccionService) { }

    @Get()
    async GetInte(@Query() data: GetOneIntedto, @GetUser() user: User) {
        return await this.InteraccionService.GetInte(data.local ? data.idLocal : data.idEvento, user, data.local)
    }

    @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario, )
    @Put(':tipo/:accion')

    async interactuar(
        @Param('tipo') tipo: 'local' | 'evento',
        @Param('accion') accion: 'like' | 'compartir' | 'visto',
        @Query() data: GetOneDto,
        @GetUser() user: User
    ) {
        const isLocal = tipo === 'local';

        // Mapeo de acciones a números o enums (según lo que use tu servicio)
        const acciones = {
            like: 1,
            compartir: 2,
            visto: 3,
        };

        const accionId = acciones[accion];
        if (!accionId) throw new BadRequestException(`Acción no válida: ${accion}`);

        return await this.InteraccionService.switchInte(accionId, data, user, isLocal);
        
    }



}
