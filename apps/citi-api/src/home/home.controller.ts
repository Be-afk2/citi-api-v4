/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards, Request, Query, NotFoundException } from '@nestjs/common';
import { HomeService } from './home.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GeoDataDto } from '../geolocalizacion/dto/geoData.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { query } from 'express';
import { get } from 'http';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';

@Controller('home')
export class HomeController {

    constructor(
        private readonly homeService: HomeService
    ) { }

    ComprobarUser(user: User) {
        if (user.ciudad == undefined) { throw new NotFoundException('Usuario sin ciudad asociada'); }

    }


    @Get('local')
    @UseAuthUser(
        ValidRoles.SuperAdmin,
        ValidRoles.Usuario,
        ValidRoles.Guest

    )
    async homeLocal(@Query() data: GeoDataDto, @GetUser() user: User) {
        this.ComprobarUser(user);


        return this.homeService.homeLocal(data, user);


    }


    @Get('evento')
    @UseAuthUser(
        ValidRoles.SuperAdmin,
        ValidRoles.Usuario,
        ValidRoles.Guest

    )
    async homeEvento(@Query() data: GeoDataDto, @GetUser() user: User) {
        this.ComprobarUser(user);


        return this.homeService.homeEvento(data, user);

    }
    
    @Get('preferencia')
    @UseAuthUser(
        ValidRoles.SuperAdmin,
        ValidRoles.Usuario,
        
    )
    async GetPreferencias(@Query() data: GeoDataDto,@GetUser() user: User) {

        return await this.homeService.GetPreferencias(user, data);
    }

    // rincon necro turismo

    @Get("necro")
    @UseAuthUser(
        ValidRoles.SuperAdmin,
        ValidRoles.Usuario,
        ValidRoles.Guest
    )
    async homeNecro(@Query() data: GeoDataDto, @GetUser() user: User) {
        this.ComprobarUser(user);

        return this.homeService.homeNecro(data, user);
    }

}
