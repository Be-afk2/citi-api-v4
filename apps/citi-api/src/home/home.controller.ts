/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
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



    @Get('local')
    @UseAuthUser(
        ValidRoles.SuperAdmin,
        ValidRoles.Usuario,
    )
    async homeLocal(@Query() data: GeoDataDto, @GetUser() user: User) {
        {

            return this.homeService.homeLocal(data, user);
        }


    }
}
