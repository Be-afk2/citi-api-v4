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

@Controller('home')
export class HomeController {

    constructor(
        private readonly homeService: HomeService
    ) { }



    @Get('local')
    @UseGuards(JwtAuthGuard)
    async homeLocal(@Query() data: GeoDataDto) {
        {


            return this.homeService.homeLocal(data);
        }


    }
}
